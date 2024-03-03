import axios from 'axios';
import { IpfsClient, IpfsResult } from "./ipfsClient";

export class PinataIpfsClient extends IpfsClient {
  private pinataJwt: string;
  private dedicatedGatewayUrl?: string;

  constructor(pinataJwt: string | undefined, dedicatedGatewayUrl?: string) {
    super("Pinata");
    if (!pinataJwt) {
      throw new Error("Pinata JWT is required");
    }
    this.pinataJwt = pinataJwt;
    if (dedicatedGatewayUrl) {
      if (dedicatedGatewayUrl[dedicatedGatewayUrl.length - 1] === "/") {
        dedicatedGatewayUrl = dedicatedGatewayUrl.slice(0, -1);
        if (!dedicatedGatewayUrl.endsWith("/ipfs")) {
          dedicatedGatewayUrl += "/ipfs";
        }
        this.dedicatedGatewayUrl = dedicatedGatewayUrl;
      }
    }
  }

  private getUrl(): string {
    if (this.dedicatedGatewayUrl) {
      return `${this.dedicatedGatewayUrl}`;
    }
    return `https://gateway.pinata.cloud/ipfs`;
  }

  async getSize(hashOrCid: string): Promise<IpfsResult> {
    try {
      if (hashOrCid.startsWith("0x")) {
        hashOrCid = this.convertBytes32ToIpfsCid(hashOrCid);
      }
      // Pinata gateway will not return data size on a head request, so we need to use 
      // the public ipfs.io gateway instead.
      const res = await axios.head(`https://ipfs.io/ipfs/${hashOrCid}`);
      const size = res.headers["x-ipfs-datasize"];
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
      const url = this.getUrl();
      const res = await axios.get(`${url}/${hashOrCid}`, {
        headers: {
          Authorization: `Bearer ${this.pinataJwt}`,
        }
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
    const dataObj = {
      "pinataContent": {
        "data": data,
      },
      "pinataOptions": {
        "cidVersion": 0,
        "wrapWithDirectory": false,
      }
    }
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        dataObj,
        {
          headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${this.pinataJwt}`,
          }
        }
      );
      const cid = res.data.IpfsHash
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
      const res = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${hashOrCid}`, {
        headers: {
          Authorization: `Bearer ${this.pinataJwt}`,
        }
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