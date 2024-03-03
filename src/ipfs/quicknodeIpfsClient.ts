import axios from 'axios';
import FormData from 'form-data';
import { IpfsClient, IpfsResult } from "./ipfsClient";

// Maximum number of pages to get all pinned objects
const MAX_PAGES = 1000;

export class QuicknodeIpfsClient extends IpfsClient {
  private gatewayUrl: string;
  private apiKey: string;

  constructor(apiKey: string, gatewayUrl: string) {
    super("Quicknode");
    if (gatewayUrl[gatewayUrl.length - 1] === "/") {
      gatewayUrl = gatewayUrl.slice(0, -1);
      if (!gatewayUrl.endsWith("/ipfs")) {
        gatewayUrl += "/ipfs";
      }
    }
    this.gatewayUrl = gatewayUrl;
    this.apiKey = apiKey;
  }

  async getSize(hashOrCid: string): Promise<IpfsResult> {
    try {
      if (hashOrCid.startsWith("0x")) {
        hashOrCid = this.convertBytes32ToIpfsCid(hashOrCid);
      }
      const res = await axios.head(`${this.gatewayUrl}/${hashOrCid}`);
      const size = res.headers["content-length"];
      if (!size) {
        return {
          status: res.status,
          value: null,
        }
      }
      return {
        status: res.status,
        value: size,
      };
    } catch (e: any) {
      return {
        status: e.response?.status ?? 500,
        value: e.message,
      };
    }
  }

  async read(hashOrCid: string): Promise<IpfsResult> {
    try {
      if (hashOrCid.startsWith("0x")) {
        hashOrCid = this.convertBytes32ToIpfsCid(hashOrCid);
      }
      const res = await axios.get(`${this.gatewayUrl}/${hashOrCid}`, {
        headers: {
          "x-api-key": this.apiKey,
        },
      });
      if (!(res.data.data || res.data)) {
        return {
          status: res.status,
          value: null,
        };
      }
      return {
        status: res.status,
        value: res.data.data ?? res.data,
      };
    } catch (e: any) {
      return {
        status: e.response?.status ?? 500,
        value: e.message,
      }
    }
  }

  async pin(data: string): Promise<IpfsResult> {
    const path = Date.now().toString();
    const formdata = new FormData();
    formdata.append("Body", data, path);
    formdata.append("Key", path);
    formdata.append("ContentType", "text/plain");
    
    try {
      const res = await axios.post(
        `https://api.quicknode.com/ipfs/rest/v1/s3/put-object`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-key": this.apiKey,
          },
        }
      );
      const cid = res.data.pin.cid;
      return {
        status: res.status,
        value: this.convertIpfsCidToBytes32(cid),
      };
    } catch (e: any) {
      return {
        status: e.response?.status ?? 500,
        value: null,
      };
    }
  }

  async unpin(hashOrCid: string): Promise<IpfsResult> {
    try {
      if (hashOrCid.startsWith("0x")) {
        hashOrCid = this.convertBytes32ToIpfsCid(hashOrCid);
      }

      // Get all user's pinned objects
      let pinnedCidRequestIds: {[cid: string]: string} = {};
      let pageNumber = 1;
      while (true) {
        const res = await axios.get(`https://api.quicknode.com/ipfs/rest/v1/pinning?` + new URLSearchParams({
          pageNumber: pageNumber.toString(),
          perPage: "100",
        }), {
          headers: {
            "x-api-key": this.apiKey,
          },
        });
        res.data.data.forEach((pinnedObject: any) => {
          pinnedCidRequestIds[pinnedObject.cid] = pinnedObject.requestId;
        });
        if (pageNumber === res.data.totalPages || pageNumber > MAX_PAGES) {
          break;
        }
        pageNumber++;
      }

      const requestId = pinnedCidRequestIds[hashOrCid];
      const res = await axios.delete(`https://api.quicknode.com/ipfs/rest/v1/pinning/${requestId}`, {
        headers: {
          "x-api-key": this.apiKey,
        },
      });
      
      return {
        status: res.status,
        value: true,
      };
    } catch (e: any) {
      return {
        status: e.response?.status ?? 500,
        value: false,
      };
    }
  }
}