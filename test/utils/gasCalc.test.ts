import { calculateCalldataGas } from "../../src";

// Test coverage areas:
// - Calldata gas calculator

describe("Calldata Gas Calculator", () => {
  test("basic calculator test", () => {
    const gas = calculateCalldataGas("0x123456789000");
    expect(gas).toEqual(84);
  });

  test("arbitrary gas cost", () => {
    const oldVkey = "0x0001000009000100000004010000010080000000000000000000000000000000c562ed60c110f4e0ca53d33b0e1fe0d1fc10db6d997001813ecd409d378f220cc04b25057d0bddf35d4542077516abb76445b8e745a457e3ccc1bf9aac2ba406977facb333a6cae3726c695dceea3b6a2a4ddce29428b70ddd989ea1fe60014f25443655c0b66da8a310f273dd57db7843cd3800fa5d24c415c3e13b5f035a6b000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080c28c31d22d8f204e81b8fc714de26d87c1d4c756632cad0668655fd09220762a2f3064cf682958accb92639a8a276e8d491b49c5f2d1557fe686e8805641f21922e4c62aacfc240ed0553bfad00122ba8c7627c870c739f3f818584e066a8b1f841485e0a9f109688bdc4f5ff851d9e2e44833ae573456742c1237322e93854279a62f1cc2f1440cc9fdcd534b612a49da4b6139bbed8cf53a26f4568ac3f567e40c0e4521b32cf17ce45eee625a7e525481b412984310e1fb44eef5a34ab34cf4d1a7e36933bfb413c2f451097e4cd1ab67e8a4cb0a1bdac2d05284e48be45e";
    const newVkey = "0x0001000009000100000014030000010080000000000000000000000000000000c60fa9c24296296126123ba55b4a1cdf65d078c61351a288f7fe424e48f6f81bc04b25057d0bddf35d4542077516abb76445b8e745a457e3ccc1bf9aac2ba406977facb333a6cae3726c695dceea3b6a2a4ddce29428b70ddd989ea1fe60014f25443655c0b66da8a310f273dd57db7843cd3800fa5d24c415c3e13b5f035a6b0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080c28c31d22d8f204e81b8fc714de26d87c1d4c756632cad0668655fd09220762ac97e680c26aa7578d2a619a036f989a54d69901c0dfebe50e4550c91e77aff6622e4c62aacfc240ed0553bfad00122ba8c7627c870c739f3f818584e066a8b1f841485e0a9f109688bdc4f5ff851d9e2e44833ae573456742c1237322e93854279a62f1cc2f1440cc9fdcd534b612a49da4b6139bbed8cf53a26f4568ac3f567e40c0e4521b32cf17ce45eee625a7e525481b412984310e1fb44eef5a34ab34c62ee0fe9aa8394ac79f7db54f83e432a353c7f066c180a9e7a7a37d8d1a19621797cae9e008e1a1c6179a2669e046910e331c74b4e57daa2e643d7890a9ffe42ce5a4cc0f54b73ff0bcedb8c86a757af5e46284d55d21880e1a0a5fb244b0261e55f1e07004fb3e7beed33d7e81056d3aa999d1dd24a44f9aa260809521c156e3fa7d77341d8aa211ce29a49741679c8f72e90b0390993d99c6d8c0aaac11d57b76b2ff2659b4946451a50ff328d54bc43c0b63aa8918a58c07a4341317335060492eec333e48f59fe81084a4736040410107225455b86fa305be40e8a87fb081e80637e88a5119875eb33158d940b2e9d329d7b789a255cb0046b30b104fd10197bad10d254ed326b9f05b266b708e494b3c0d51e1029cc45cc733dddec406d0bfd7893d41759553d6bf679e019ebf724d06bf4c90a06290c16e94e31fe6e2882f323b6df6e395c26e47adac9c17a3e523baac0032760248f6cba2d26b3a606a038b067a84e5393fc5a765d129ba9623dbd01440dd62cf50bc20778c64d3e11d43319b40899edee653a91cdf3e54cc87b8a872e8c60228a51494bfd095c856ba7dfc2ccf04eeb0022d8c1d6c4afb79c908f5badd91a6ca58b4a9683edac8b2c0b239c177ecb6c67c8c45eee7e7398e12e96f7e42c80e2638960a2b367a026016c4e6756b257b8be2ca2553d710b966c469d7f976e4d3694f9bb86300db5886468609c0ad2b8ca67724c13e56a430669835624483db35d2217c517d74f9b864a0df9bbba485cc4c479ef23f0934510a5d86445a424ad80f5c68c62590b8f244da2d4a115c90c5ffa24d12d55d16890778e67b5085bc11ec9c15257c8ddffe025";
    const oldGas = calculateCalldataGas(oldVkey);
    const newGas = calculateCalldataGas(newVkey);
    expect(oldGas).toBeLessThan(newGas);
  })
});
