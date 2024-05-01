import { toBeHex } from "ethers";
import {
  getDataQueryHashFromSubqueries,
  DataSubqueryType,
  DataSubquery,
  AxiomV2ComputeQuery,
  AxiomV2Callback,
  HeaderField,
  AccountField,
  TxField,
  AxiomV2DataQuery,
  bytes32,
  AxiomV2FeeData,
  HeaderSubquery,
  AccountSubquery,
  StorageSubquery,
  TxSubquery,
  ReceiptSubquery,
  SolidityNestedMappingSubquery,
} from "../../../../src";


// Encoded data

export const encodedQuery =
  "0x020000000000000001b392448932f6ef430555631f765df0dfae34eff30673ecce02ef9e49252980d292337dc68b69a35f31e39f5b4a8608542c5808920e00020ebe9df5238dceff54fa804e4595ec681b5b531469372c90a4c66e54f7838ce20fc04b25057d0bddf35d4542077516abb76445b8e745a457e3ccc1bf9aac2ba40609fb99633315342c07ddd4bab72cfa9e89824e909314cf31f75e13ee24fb2b472d1e39c178c1c193eb329019dddfd310f4bb6e4c8907219b70e24db8b1802047000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080c794ad62c739a4980719c91c986c3528cf18aebccde48d8b6398e77dd478086433d9164d0bfa56aac8389cbe7f54261ca943344764389241dcd95570181cfd1d22e4c62aacfc240ed0553bfad00122ba8c7627c870c739f3f818584e066a8b1f841485e0a9f109688bdc4f5ff851d9e2e44833ae573456742c1237322e93854279a62f1cc2f1440cc9fdcd534b612a49da4b6139bbed8cf53a26f4568ac3f5677890b747b8190cb4366ce2ebd5d3234ea4ccc35c6da003af62d93077f1d192649b11a4f0f83422d5403d4b69c7f32be55e733a56096911fa1ab95342b6f3110c000008a0c42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67000000000000000000000000b392448932f6ef430555631f765df0dfae34eff3000000000000000000000000000000000000000000000000000000000092a6530000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad0d3d3dcfc9f6777cc5f4fe79a4a4bc394480c91776451fed0e53bee304e6ba51d9b1c84f81c7cfa5df53cd495afe8078e18938210082118baa078edad02e3a101188b835fce8eaf682dfa6dffeb9b1fad28dd4bf4535fd901260a282821fe41f86997c07c4c10fa50fdb973395fc27f0a423982501bf052607983874129f5d08b9454b6dff63d23697664a22703985abf0dcbf206ae26ad893f3452f161cf70a8f57efff4fdade9b2b9addf115afd14363f621931499067e144aca1392102e2e9c3410bf7f26aa6aa4b65c58612de327a3fc811d2577b6d284bb3507cd5eb004097987cc32b3e17772f8d6b45c6905a80c3655a9d3a9e27d407672100188b4184b03335ab8ba1cad7fddc305488cef6b1c1764f1a1067e2eb38c3d2b57abb5217981d402e02d67f82661d6d45fe5dfe629f4087135471f9f34cee61f20026f6fa000762da1318e2db4606154b97758b7cc0e390507730abfdf31095fc2b8452ab9e57acf3332739917e7b6796caa04bc722b2c06613a8a583b98af7d4578700a4ce009ea1cb0344b62146421099dd9382dd3109400373528e0a54241c50f36418ff058add2bff589bdc5c717efd96cdf949871d9615acc8d9c2f13570c5c14282a5f8b37cd2c68945b7e0211e221dea1c8648ea225a0f8247f5de75d7c734817a4a0a52a38a83ddefe77175fadaa50c8e815f22532c6b3a2a36b1606fe564c2e32f2767f878c952154d00d92b99034c443db9f84edeaf5cce82a19343e272706f59d193f070c1be07ea0aa8cb452773c0e205249e5b7e3726c6b4fb23c06e02dc355d45e3ec238e9dc64e5a1590a59daf8b72b666467de6e1bc82d8fe04fe42744bd44e29184cba80bff8831c358e9f3c7fac336a5ac0619b5f3c8ce0e83d407856b62d904d83194d0d6a4b306e54716a9612da94162fac8b2bfa0050075a42b9413b0ffe068c1d6f03747c456df76de07fb56768ab193beea54b1e0e8957a14f8658b5aeb63d22b80aa4ed5b403efa298d83771578535de585d2a3980781a2cd86fdf043feb8d862b78efa9835eee4d0db24fa3f2ea2280ab1b6da4983f6d28245997cbaaf391eacf503b5fcadf751a4d75898bf0f83d83b1e8ed8ad755451dd1dd2540b86bb86e1fdc6564d63f323fda56df4fb2bb7120d8cccc956a33e00141cd5d6b8860b46e7b29325b2b5f2f13f62ab1b33920210d9a8f4fb577b12d0731d08be9974a029c170a0408cfbc1da837a8bca104a6294d8caad889e585b51eab00646615e9b06cfdd9d72e4086a96e58438d4e7d2ee11f5adccc3b4a5269206f5f269909f9d308858b80f28f91f25141f95f3a51071923b42a706439be350bdd95d9ebc8fc3bb4301359ea34b6e3604afb0b0bd4416b575ff6b34eeee8f10f500e126fa83c86e068eed8bb643ae06fec29e5e6f45d392e2a519ae431622c263ba38665a6f6c91cd77833afd6c0fa7257a92db8a5c7de33f6a2db87806f2f086a9d0fdc54a74d150020943fcde74ce368d49cfe3316e8430193a9daf7bc4a2c3382c45dd107096d00c7b5ad1d63a94c4e27f273916474abbfd61cf90aec811ea5fb074a47130df2c3c9e8c8b8db955898eb8dfe63b4803f5ecad1b9b88a6709000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9f5fec449c496a0cfdccc0a4bc5ad39e6e9dec27516330beb88e95175b0ba008833e17e67438ab42a9f760c073534980091ef03ab7118d164a2e653f53d2e2fb54bcdf449421cb84757ec0bc29c04ea80f6b2bc456f40f67dc8c561991d5507414d96c2f2c151f486f6a9326278099e089579e8c3fc9b975be2ace0e43b73020c1c43dbb2e52d32d65d9de7aa89b3557aad08c678165694a9b904cf0e9fd62d94c2ca61c3520233bed1d8233a50f9e2b80992e8685c2dfa6dcc5aa5c918301764eea6e00f5ee1c23616df6204156a57596f1a341d4f4154e6431cfb1da5fc01556c7610642692910980aabdeb11b956505bd72a7efa7e7365f0ce257fc00a0f6a44e829903c83c338fe9a621318ad3eb1e89e5216da6893d3e824f7781c710c12b5252f195ac2470f859d2960c7288e422f5c2a0cfa84897d70d9b705a27022a6d01c3b1fc45fe17221190cc4aef7a1ada82f13be0ef40112c952fe6673cf220ef543aa8547b3f29c3248c21703fdbe1b748c92d78e67f06128884bf31ac417afb77a74f3d1d66619c9b9dc32e31d949db968c005371bded9151d90269fb82eb7462b21a3070dfa50bf5ec1006e1acb42bf1a8fba538eda2aba80e6373b01021fe46978631e8364b050693093449ef69e0783e12349ca6f3d5f07ed3712460c6c7003c8c8f92ed3c6775ff9ada5b25a14438f50b7b4611144281c662c43a307162bffbc70b021dda97fa44e33e04b01e22518f1dca2635381220e13498dc62f6a4df001951c0c73354193815cba74b3acd0b4eda030ae404af0c2246ab9a52d25bd6f4f831cb073a22b1510499373d72ed277b3b4d2a12411f8318a1b9330095ce731d4eb0327cd92878dd258b8bc9a3ac56d4685532397b6ef859f5399ae13dcd2787bd231179e82588f2e88ccda78a9770818056cc2bdec258cd0395e8f2575e9fe9185ff7261a43e6d76103ef5fb8fe7db920b3754f6cebb5b6874448e01c3c2ce1195e5518cd53e822f2b5470841a21bc8c7c16c35710b1476f2276811499fcdd6a73b6bcd6dc5f214487fdc8c63a9a777c3db8baf46493579e14d36b1b6880df426daeecd3d1bdd48beed6ba129ed866161363352da2a6c50c2c91431e69ba703c269df8f900312577fbd1095c8cdc457c5c7ce18130565f1ebdd1a617b392448932f6ef430555631f765df0dfae34eff30002123400000005d21dba0000030d40000000000000000000000000000000000000000000000000000000000000200051416b72bd980c4fe62fb361a1abce1da5d70d6e8264221ad92796363284d1fef591c4c1e179a5e16407116882f7f8a524d51d14";
export const encodedFullQuery =
  "0x020000000000000001b392448932f6ef430555631f765df0dfae34eff300000000000000010007000100ed14f200000002000100ed14f300000009000200ed14f2c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000003000300ed14f2c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000001000400e5cfce007200000005000500e5cfce00720000000000000000255910aca2752f3c05fcb4a54d3d8d93bb809a9c8cc215d5eed2504d44cbd865000600ed14f21f98431c8ad98523631ae4a59f267346ea31f984000000000000000000000000000000000000000000000000000000000000000503000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000d31a59c85ae9d8edefec411d448f90841571b89c00000000000000000000000000000000000000000000000000000000000027100e00020ebe9df5238dceff54fa804e4595ec681b5b531469372c90a4c66e54f7838ce20fc04b25057d0bddf35d4542077516abb76445b8e745a457e3ccc1bf9aac2ba40609fb99633315342c07ddd4bab72cfa9e89824e909314cf31f75e13ee24fb2b472d1e39c178c1c193eb329019dddfd310f4bb6e4c8907219b70e24db8b1802047000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080c794ad62c739a4980719c91c986c3528cf18aebccde48d8b6398e77dd478086433d9164d0bfa56aac8389cbe7f54261ca943344764389241dcd95570181cfd1d22e4c62aacfc240ed0553bfad00122ba8c7627c870c739f3f818584e066a8b1f841485e0a9f109688bdc4f5ff851d9e2e44833ae573456742c1237322e93854279a62f1cc2f1440cc9fdcd534b612a49da4b6139bbed8cf53a26f4568ac3f5677890b747b8190cb4366ce2ebd5d3234ea4ccc35c6da003af62d93077f1d192649b11a4f0f83422d5403d4b69c7f32be55e733a56096911fa1ab95342b6f3110c000008a0c42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67000000000000000000000000b392448932f6ef430555631f765df0dfae34eff3000000000000000000000000000000000000000000000000000000000092a6530000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad0d3d3dcfc9f6777cc5f4fe79a4a4bc394480c91776451fed0e53bee304e6ba51d9b1c84f81c7cfa5df53cd495afe8078e18938210082118baa078edad02e3a101188b835fce8eaf682dfa6dffeb9b1fad28dd4bf4535fd901260a282821fe41f86997c07c4c10fa50fdb973395fc27f0a423982501bf052607983874129f5d08b9454b6dff63d23697664a22703985abf0dcbf206ae26ad893f3452f161cf70a8f57efff4fdade9b2b9addf115afd14363f621931499067e144aca1392102e2e9c3410bf7f26aa6aa4b65c58612de327a3fc811d2577b6d284bb3507cd5eb004097987cc32b3e17772f8d6b45c6905a80c3655a9d3a9e27d407672100188b4184b03335ab8ba1cad7fddc305488cef6b1c1764f1a1067e2eb38c3d2b57abb5217981d402e02d67f82661d6d45fe5dfe629f4087135471f9f34cee61f20026f6fa000762da1318e2db4606154b97758b7cc0e390507730abfdf31095fc2b8452ab9e57acf3332739917e7b6796caa04bc722b2c06613a8a583b98af7d4578700a4ce009ea1cb0344b62146421099dd9382dd3109400373528e0a54241c50f36418ff058add2bff589bdc5c717efd96cdf949871d9615acc8d9c2f13570c5c14282a5f8b37cd2c68945b7e0211e221dea1c8648ea225a0f8247f5de75d7c734817a4a0a52a38a83ddefe77175fadaa50c8e815f22532c6b3a2a36b1606fe564c2e32f2767f878c952154d00d92b99034c443db9f84edeaf5cce82a19343e272706f59d193f070c1be07ea0aa8cb452773c0e205249e5b7e3726c6b4fb23c06e02dc355d45e3ec238e9dc64e5a1590a59daf8b72b666467de6e1bc82d8fe04fe42744bd44e29184cba80bff8831c358e9f3c7fac336a5ac0619b5f3c8ce0e83d407856b62d904d83194d0d6a4b306e54716a9612da94162fac8b2bfa0050075a42b9413b0ffe068c1d6f03747c456df76de07fb56768ab193beea54b1e0e8957a14f8658b5aeb63d22b80aa4ed5b403efa298d83771578535de585d2a3980781a2cd86fdf043feb8d862b78efa9835eee4d0db24fa3f2ea2280ab1b6da4983f6d28245997cbaaf391eacf503b5fcadf751a4d75898bf0f83d83b1e8ed8ad755451dd1dd2540b86bb86e1fdc6564d63f323fda56df4fb2bb7120d8cccc956a33e00141cd5d6b8860b46e7b29325b2b5f2f13f62ab1b33920210d9a8f4fb577b12d0731d08be9974a029c170a0408cfbc1da837a8bca104a6294d8caad889e585b51eab00646615e9b06cfdd9d72e4086a96e58438d4e7d2ee11f5adccc3b4a5269206f5f269909f9d308858b80f28f91f25141f95f3a51071923b42a706439be350bdd95d9ebc8fc3bb4301359ea34b6e3604afb0b0bd4416b575ff6b34eeee8f10f500e126fa83c86e068eed8bb643ae06fec29e5e6f45d392e2a519ae431622c263ba38665a6f6c91cd77833afd6c0fa7257a92db8a5c7de33f6a2db87806f2f086a9d0fdc54a74d150020943fcde74ce368d49cfe3316e8430193a9daf7bc4a2c3382c45dd107096d00c7b5ad1d63a94c4e27f273916474abbfd61cf90aec811ea5fb074a47130df2c3c9e8c8b8db955898eb8dfe63b4803f5ecad1b9b88a6709000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9f5fec449c496a0cfdccc0a4bc5ad39e6e9dec27516330beb88e95175b0ba008833e17e67438ab42a9f760c073534980091ef03ab7118d164a2e653f53d2e2fb54bcdf449421cb84757ec0bc29c04ea80f6b2bc456f40f67dc8c561991d5507414d96c2f2c151f486f6a9326278099e089579e8c3fc9b975be2ace0e43b73020c1c43dbb2e52d32d65d9de7aa89b3557aad08c678165694a9b904cf0e9fd62d94c2ca61c3520233bed1d8233a50f9e2b80992e8685c2dfa6dcc5aa5c918301764eea6e00f5ee1c23616df6204156a57596f1a341d4f4154e6431cfb1da5fc01556c7610642692910980aabdeb11b956505bd72a7efa7e7365f0ce257fc00a0f6a44e829903c83c338fe9a621318ad3eb1e89e5216da6893d3e824f7781c710c12b5252f195ac2470f859d2960c7288e422f5c2a0cfa84897d70d9b705a27022a6d01c3b1fc45fe17221190cc4aef7a1ada82f13be0ef40112c952fe6673cf220ef543aa8547b3f29c3248c21703fdbe1b748c92d78e67f06128884bf31ac417afb77a74f3d1d66619c9b9dc32e31d949db968c005371bded9151d90269fb82eb7462b21a3070dfa50bf5ec1006e1acb42bf1a8fba538eda2aba80e6373b01021fe46978631e8364b050693093449ef69e0783e12349ca6f3d5f07ed3712460c6c7003c8c8f92ed3c6775ff9ada5b25a14438f50b7b4611144281c662c43a307162bffbc70b021dda97fa44e33e04b01e22518f1dca2635381220e13498dc62f6a4df001951c0c73354193815cba74b3acd0b4eda030ae404af0c2246ab9a52d25bd6f4f831cb073a22b1510499373d72ed277b3b4d2a12411f8318a1b9330095ce731d4eb0327cd92878dd258b8bc9a3ac56d4685532397b6ef859f5399ae13dcd2787bd231179e82588f2e88ccda78a9770818056cc2bdec258cd0395e8f2575e9fe9185ff7261a43e6d76103ef5fb8fe7db920b3754f6cebb5b6874448e01c3c2ce1195e5518cd53e822f2b5470841a21bc8c7c16c35710b1476f2276811499fcdd6a73b6bcd6dc5f214487fdc8c63a9a777c3db8baf46493579e14d36b1b6880df426daeecd3d1bdd48beed6ba129ed866161363352da2a6c50c2c91431e69ba703c269df8f900312577fbd1095c8cdc457c5c7ce18130565f1ebdd1a617b392448932f6ef430555631f765df0dfae34eff30002123400000005d21dba0000030d40000000000000000000000000000000000000000000000000000000000000200051416b72bd980c4fe62fb361a1abce1da5d70d6e8264221ad92796363284d1fef591c4c1e179a5e16407116882f7f8a524d51d14";
export const encodedFullQueryInvalidVersion =
  "0x030000000000000001b392448932f6ef430555631f765df0dfae34eff300000000000000010007000100ed14f200000002000100ed14f300000009000200ed14f2c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000003000300ed14f2c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000001000400e5cfce007200000005000500e5cfce00720000000000000000255910aca2752f3c05fcb4a54d3d8d93bb809a9c8cc215d5eed2504d44cbd865000600ed14f21f98431c8ad98523631ae4a59f267346ea31f984000000000000000000000000000000000000000000000000000000000000000503000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000d31a59c85ae9d8edefec411d448f90841571b89c00000000000000000000000000000000000000000000000000000000000027100e00020ebe9df5238dceff54fa804e4595ec681b5b531469372c90a4c66e54f7838ce20fc04b25057d0bddf35d4542077516abb76445b8e745a457e3ccc1bf9aac2ba40609fb99633315342c07ddd4bab72cfa9e89824e909314cf31f75e13ee24fb2b472d1e39c178c1c193eb329019dddfd310f4bb6e4c8907219b70e24db8b1802047000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080c794ad62c739a4980719c91c986c3528cf18aebccde48d8b6398e77dd478086433d9164d0bfa56aac8389cbe7f54261ca943344764389241dcd95570181cfd1d22e4c62aacfc240ed0553bfad00122ba8c7627c870c739f3f818584e066a8b1f841485e0a9f109688bdc4f5ff851d9e2e44833ae573456742c1237322e93854279a62f1cc2f1440cc9fdcd534b612a49da4b6139bbed8cf53a26f4568ac3f5677890b747b8190cb4366ce2ebd5d3234ea4ccc35c6da003af62d93077f1d192649b11a4f0f83422d5403d4b69c7f32be55e733a56096911fa1ab95342b6f3110c000008a0c42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67000000000000000000000000b392448932f6ef430555631f765df0dfae34eff3000000000000000000000000000000000000000000000000000000000092a6530000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad0d3d3dcfc9f6777cc5f4fe79a4a4bc394480c91776451fed0e53bee304e6ba51d9b1c84f81c7cfa5df53cd495afe8078e18938210082118baa078edad02e3a101188b835fce8eaf682dfa6dffeb9b1fad28dd4bf4535fd901260a282821fe41f86997c07c4c10fa50fdb973395fc27f0a423982501bf052607983874129f5d08b9454b6dff63d23697664a22703985abf0dcbf206ae26ad893f3452f161cf70a8f57efff4fdade9b2b9addf115afd14363f621931499067e144aca1392102e2e9c3410bf7f26aa6aa4b65c58612de327a3fc811d2577b6d284bb3507cd5eb004097987cc32b3e17772f8d6b45c6905a80c3655a9d3a9e27d407672100188b4184b03335ab8ba1cad7fddc305488cef6b1c1764f1a1067e2eb38c3d2b57abb5217981d402e02d67f82661d6d45fe5dfe629f4087135471f9f34cee61f20026f6fa000762da1318e2db4606154b97758b7cc0e390507730abfdf31095fc2b8452ab9e57acf3332739917e7b6796caa04bc722b2c06613a8a583b98af7d4578700a4ce009ea1cb0344b62146421099dd9382dd3109400373528e0a54241c50f36418ff058add2bff589bdc5c717efd96cdf949871d9615acc8d9c2f13570c5c14282a5f8b37cd2c68945b7e0211e221dea1c8648ea225a0f8247f5de75d7c734817a4a0a52a38a83ddefe77175fadaa50c8e815f22532c6b3a2a36b1606fe564c2e32f2767f878c952154d00d92b99034c443db9f84edeaf5cce82a19343e272706f59d193f070c1be07ea0aa8cb452773c0e205249e5b7e3726c6b4fb23c06e02dc355d45e3ec238e9dc64e5a1590a59daf8b72b666467de6e1bc82d8fe04fe42744bd44e29184cba80bff8831c358e9f3c7fac336a5ac0619b5f3c8ce0e83d407856b62d904d83194d0d6a4b306e54716a9612da94162fac8b2bfa0050075a42b9413b0ffe068c1d6f03747c456df76de07fb56768ab193beea54b1e0e8957a14f8658b5aeb63d22b80aa4ed5b403efa298d83771578535de585d2a3980781a2cd86fdf043feb8d862b78efa9835eee4d0db24fa3f2ea2280ab1b6da4983f6d28245997cbaaf391eacf503b5fcadf751a4d75898bf0f83d83b1e8ed8ad755451dd1dd2540b86bb86e1fdc6564d63f323fda56df4fb2bb7120d8cccc956a33e00141cd5d6b8860b46e7b29325b2b5f2f13f62ab1b33920210d9a8f4fb577b12d0731d08be9974a029c170a0408cfbc1da837a8bca104a6294d8caad889e585b51eab00646615e9b06cfdd9d72e4086a96e58438d4e7d2ee11f5adccc3b4a5269206f5f269909f9d308858b80f28f91f25141f95f3a51071923b42a706439be350bdd95d9ebc8fc3bb4301359ea34b6e3604afb0b0bd4416b575ff6b34eeee8f10f500e126fa83c86e068eed8bb643ae06fec29e5e6f45d392e2a519ae431622c263ba38665a6f6c91cd77833afd6c0fa7257a92db8a5c7de33f6a2db87806f2f086a9d0fdc54a74d150020943fcde74ce368d49cfe3316e8430193a9daf7bc4a2c3382c45dd107096d00c7b5ad1d63a94c4e27f273916474abbfd61cf90aec811ea5fb074a47130df2c3c9e8c8b8db955898eb8dfe63b4803f5ecad1b9b88a6709000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9f5fec449c496a0cfdccc0a4bc5ad39e6e9dec27516330beb88e95175b0ba008833e17e67438ab42a9f760c073534980091ef03ab7118d164a2e653f53d2e2fb54bcdf449421cb84757ec0bc29c04ea80f6b2bc456f40f67dc8c561991d5507414d96c2f2c151f486f6a9326278099e089579e8c3fc9b975be2ace0e43b73020c1c43dbb2e52d32d65d9de7aa89b3557aad08c678165694a9b904cf0e9fd62d94c2ca61c3520233bed1d8233a50f9e2b80992e8685c2dfa6dcc5aa5c918301764eea6e00f5ee1c23616df6204156a57596f1a341d4f4154e6431cfb1da5fc01556c7610642692910980aabdeb11b956505bd72a7efa7e7365f0ce257fc00a0f6a44e829903c83c338fe9a621318ad3eb1e89e5216da6893d3e824f7781c710c12b5252f195ac2470f859d2960c7288e422f5c2a0cfa84897d70d9b705a27022a6d01c3b1fc45fe17221190cc4aef7a1ada82f13be0ef40112c952fe6673cf220ef543aa8547b3f29c3248c21703fdbe1b748c92d78e67f06128884bf31ac417afb77a74f3d1d66619c9b9dc32e31d949db968c005371bded9151d90269fb82eb7462b21a3070dfa50bf5ec1006e1acb42bf1a8fba538eda2aba80e6373b01021fe46978631e8364b050693093449ef69e0783e12349ca6f3d5f07ed3712460c6c7003c8c8f92ed3c6775ff9ada5b25a14438f50b7b4611144281c662c43a307162bffbc70b021dda97fa44e33e04b01e22518f1dca2635381220e13498dc62f6a4df001951c0c73354193815cba74b3acd0b4eda030ae404af0c2246ab9a52d25bd6f4f831cb073a22b1510499373d72ed277b3b4d2a12411f8318a1b9330095ce731d4eb0327cd92878dd258b8bc9a3ac56d4685532397b6ef859f5399ae13dcd2787bd231179e82588f2e88ccda78a9770818056cc2bdec258cd0395e8f2575e9fe9185ff7261a43e6d76103ef5fb8fe7db920b3754f6cebb5b6874448e01c3c2ce1195e5518cd53e822f2b5470841a21bc8c7c16c35710b1476f2276811499fcdd6a73b6bcd6dc5f214487fdc8c63a9a777c3db8baf46493579e14d36b1b6880df426daeecd3d1bdd48beed6ba129ed866161363352da2a6c50c2c91431e69ba703c269df8f900312577fbd1095c8cdc457c5c7ce18130565f1ebdd1a617b392448932f6ef430555631f765df0dfae34eff30002123400000005d21dba0000030d40000000000000000000000000000000000000000000000000000000000000200051416b72bd980c4fe62fb361a1abce1da5d70d6e8264221ad92796363284d1fef591c4c1e179a5e16407116882f7f8a524d51d14";
export const encodedComputeQuery =
  "0x0e00020ebe9df5238dceff54fa804e4595ec681b5b531469372c90a4c66e54f7838ce20fc04b25057d0bddf35d4542077516abb76445b8e745a457e3ccc1bf9aac2ba40609fb99633315342c07ddd4bab72cfa9e89824e909314cf31f75e13ee24fb2b472d1e39c178c1c193eb329019dddfd310f4bb6e4c8907219b70e24db8b1802047000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080c794ad62c739a4980719c91c986c3528cf18aebccde48d8b6398e77dd478086433d9164d0bfa56aac8389cbe7f54261ca943344764389241dcd95570181cfd1d22e4c62aacfc240ed0553bfad00122ba8c7627c870c739f3f818584e066a8b1f841485e0a9f109688bdc4f5ff851d9e2e44833ae573456742c1237322e93854279a62f1cc2f1440cc9fdcd534b612a49da4b6139bbed8cf53a26f4568ac3f5677890b747b8190cb4366ce2ebd5d3234ea4ccc35c6da003af62d93077f1d192649b11a4f0f83422d5403d4b69c7f32be55e733a56096911fa1ab95342b6f3110c000008a0c42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67000000000000000000000000b392448932f6ef430555631f765df0dfae34eff3000000000000000000000000000000000000000000000000000000000092a6530000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad0d3d3dcfc9f6777cc5f4fe79a4a4bc394480c91776451fed0e53bee304e6ba51d9b1c84f81c7cfa5df53cd495afe8078e18938210082118baa078edad02e3a101188b835fce8eaf682dfa6dffeb9b1fad28dd4bf4535fd901260a282821fe41f86997c07c4c10fa50fdb973395fc27f0a423982501bf052607983874129f5d08b9454b6dff63d23697664a22703985abf0dcbf206ae26ad893f3452f161cf70a8f57efff4fdade9b2b9addf115afd14363f621931499067e144aca1392102e2e9c3410bf7f26aa6aa4b65c58612de327a3fc811d2577b6d284bb3507cd5eb004097987cc32b3e17772f8d6b45c6905a80c3655a9d3a9e27d407672100188b4184b03335ab8ba1cad7fddc305488cef6b1c1764f1a1067e2eb38c3d2b57abb5217981d402e02d67f82661d6d45fe5dfe629f4087135471f9f34cee61f20026f6fa000762da1318e2db4606154b97758b7cc0e390507730abfdf31095fc2b8452ab9e57acf3332739917e7b6796caa04bc722b2c06613a8a583b98af7d4578700a4ce009ea1cb0344b62146421099dd9382dd3109400373528e0a54241c50f36418ff058add2bff589bdc5c717efd96cdf949871d9615acc8d9c2f13570c5c14282a5f8b37cd2c68945b7e0211e221dea1c8648ea225a0f8247f5de75d7c734817a4a0a52a38a83ddefe77175fadaa50c8e815f22532c6b3a2a36b1606fe564c2e32f2767f878c952154d00d92b99034c443db9f84edeaf5cce82a19343e272706f59d193f070c1be07ea0aa8cb452773c0e205249e5b7e3726c6b4fb23c06e02dc355d45e3ec238e9dc64e5a1590a59daf8b72b666467de6e1bc82d8fe04fe42744bd44e29184cba80bff8831c358e9f3c7fac336a5ac0619b5f3c8ce0e83d407856b62d904d83194d0d6a4b306e54716a9612da94162fac8b2bfa0050075a42b9413b0ffe068c1d6f03747c456df76de07fb56768ab193beea54b1e0e8957a14f8658b5aeb63d22b80aa4ed5b403efa298d83771578535de585d2a3980781a2cd86fdf043feb8d862b78efa9835eee4d0db24fa3f2ea2280ab1b6da4983f6d28245997cbaaf391eacf503b5fcadf751a4d75898bf0f83d83b1e8ed8ad755451dd1dd2540b86bb86e1fdc6564d63f323fda56df4fb2bb7120d8cccc956a33e00141cd5d6b8860b46e7b29325b2b5f2f13f62ab1b33920210d9a8f4fb577b12d0731d08be9974a029c170a0408cfbc1da837a8bca104a6294d8caad889e585b51eab00646615e9b06cfdd9d72e4086a96e58438d4e7d2ee11f5adccc3b4a5269206f5f269909f9d308858b80f28f91f25141f95f3a51071923b42a706439be350bdd95d9ebc8fc3bb4301359ea34b6e3604afb0b0bd4416b575ff6b34eeee8f10f500e126fa83c86e068eed8bb643ae06fec29e5e6f45d392e2a519ae431622c263ba38665a6f6c91cd77833afd6c0fa7257a92db8a5c7de33f6a2db87806f2f086a9d0fdc54a74d150020943fcde74ce368d49cfe3316e8430193a9daf7bc4a2c3382c45dd107096d00c7b5ad1d63a94c4e27f273916474abbfd61cf90aec811ea5fb074a47130df2c3c9e8c8b8db955898eb8dfe63b4803f5ecad1b9b88a6709000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9f5fec449c496a0cfdccc0a4bc5ad39e6e9dec27516330beb88e95175b0ba008833e17e67438ab42a9f760c073534980091ef03ab7118d164a2e653f53d2e2fb54bcdf449421cb84757ec0bc29c04ea80f6b2bc456f40f67dc8c561991d5507414d96c2f2c151f486f6a9326278099e089579e8c3fc9b975be2ace0e43b73020c1c43dbb2e52d32d65d9de7aa89b3557aad08c678165694a9b904cf0e9fd62d94c2ca61c3520233bed1d8233a50f9e2b80992e8685c2dfa6dcc5aa5c918301764eea6e00f5ee1c23616df6204156a57596f1a341d4f4154e6431cfb1da5fc01556c7610642692910980aabdeb11b956505bd72a7efa7e7365f0ce257fc00a0f6a44e829903c83c338fe9a621318ad3eb1e89e5216da6893d3e824f7781c710c12b5252f195ac2470f859d2960c7288e422f5c2a0cfa84897d70d9b705a27022a6d01c3b1fc45fe17221190cc4aef7a1ada82f13be0ef40112c952fe6673cf220ef543aa8547b3f29c3248c21703fdbe1b748c92d78e67f06128884bf31ac417afb77a74f3d1d66619c9b9dc32e31d949db968c005371bded9151d90269fb82eb7462b21a3070dfa50bf5ec1006e1acb42bf1a8fba538eda2aba80e6373b01021fe46978631e8364b050693093449ef69e0783e12349ca6f3d5f07ed3712460c6c7003c8c8f92ed3c6775ff9ada5b25a14438f50b7b4611144281c662c43a307162bffbc70b021dda97fa44e33e04b01e22518f1dca2635381220e13498dc62f6a4df001951c0c73354193815cba74b3acd0b4eda030ae404af0c2246ab9a52d25bd6f4f831cb073a22b1510499373d72ed277b3b4d2a12411f8318a1b9330095ce731d4eb0327cd92878dd258b8bc9a3ac56d4685532397b6ef859f5399ae13dcd2787bd231179e82588f2e88ccda78a9770818056cc2bdec258cd0395e8f2575e9fe9185ff7261a43e6d76103ef5fb8fe7db920b3754f6cebb5b6874448e01c3c2ce1195e5518cd53e822f2b5470841a21bc8c7c16c35710b1476f2276811499fcdd6a73b6bcd6dc5f214487fdc8c63a9a777c3db8baf46493579e14d36b1b6880df426daeecd3d1bdd48beed6ba129ed866161363352da2a6c50c2c91431e69ba703c269df8f900312577fbd1095c8cdc457c5c7ce18130565f1ebdd1a617";
export const encodedQueryNoCompute =
  "0x020000000000000001b392448932f6ef430555631f765df0dfae34eff30673ecce02ef9e49252980d292337dc68b69a35f31e39f5b4a8608542c580892000002b392448932f6ef430555631f765df0dfae34eff30002123400000005d21dba0000030d40000000000000000000000000000000000000000000000000000000000000200051416b72bd980c4fe62fb361a1abce1da5d70d6e8264221ad92796363284d1fef591c4c1e179a5e16407116882f7f8a524d51d14";
export const encodedCallback = "0xb392448932f6ef430555631f765df0dfae34eff300021234";

export const encodedHeaderSubquery = "0x00ed14f200000000";
export const encodedAccountSubquery = "0x00ed14f2ab5801a7d398351b8be11c439e05c5b3259aec9b00000000";
export const encodedStorageSubquery =
  "0x00ed14f2ab5801a7d398351b8be11c439e05c5b3259aec9b0000000000000000000000000000000000000000000000000000000000000000";
export const encodedTxSubquery = "0x00e5cfce007200000000";
export const encodedReceiptSubquery =
  "0x00e5cfce00720000000000000000255910aca2752f3c05fcb4a54d3d8d93bb809a9c8cc215d5eed2504d44cbd865";
export const encodedSolidityNestedMappingSubquery =
  "0x00ed14f21f98431c8ad98523631ae4a59f267346ea31f984000000000000000000000000000000000000000000000000000000000000000503000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000d31a59c85ae9d8edefec411d448f90841571b89c00000000000000000000000000000000000000000000000000000000000027100000000000000000000000000000000000000000000000000000000000000000";
export const encodedEcdsaSubquery = "0x453bb8238f3ec00dbdf9783e2f3c69a754beeab0954c08639521957cfefafabb1995eab0d6a762169daa00ba6a7b47194945d4c10efa0e38b682920141b0a2ac71231bb60a42e53c905c19a7753273b345e3be4b46de5655eead13c7f32a4c3818c6ee84cdc92d9bbb9d1186260a74650cd318d217f125e00e164bdef76bafd33c6da7e2ade483ae7c72faf20af0147467047846ddc14eef02c8fb2685cbe279";
export const encodedGroth16Subquery = "0x29c0a3411480f23aeaa644e2a26d00a218110df6e5d9e1831d23e28251e1ac009a782e96fe87646508b878982fc7f8832f03b238e7b9c7eb99673cb2caa954008edbd2e52ed5da1a974db1113de3772656df00e4132bce310b9b6b661502a400c86325c67a2d067fffc2c31ce2a2324f52bb4f2d00ed9ed4473a44b8bb5b5c003e7be4f7956d9a3906837163b153bcf42e6c4aca16f7a08bc7324d2f63c56b00ae3b8e602bee4669c9f2b9647f724db127bb7fd6a622c7362b12549ed9ed8f00869f5362385b2fa40a1fa1879c638b2e0ac2abc44235233c219283ecb1620700606d51bda75d3913000000000000000000000000000000000000000000000000810100000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000050ad449eb71c1fa9c08d5f8b5347fdb520684d44ff266a169bdf7f6346490f2a";
export const encodedDataQuery =
  "0x00000000000000010007000100ed14f200000000000100ed14f300000001000200ed14f2ab5801a7d398351b8be11c439e05c5b3259aec9b00000000000300ed14f2ab5801a7d398351b8be11c439e05c5b3259aec9b0000000000000000000000000000000000000000000000000000000000000000000400e5cfce007200000000000500e5cfce00720000000000000000255910aca2752f3c05fcb4a54d3d8d93bb809a9c8cc215d5eed2504d44cbd865000600ed14f21f98431c8ad98523631ae4a59f267346ea31f984000000000000000000000000000000000000000000000000000000000000000503000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000d31a59c85ae9d8edefec411d448f90841571b89c0000000000000000000000000000000000000000000000000000000000002710";


// Decoded data

export const BLOCK_NUMBER = 15537394;
export const VITALIK_ADDR = "0xab5801a7d398351b8be11c439e05c5b3259aec9b";
export const UNI_V3_FACTORY_ADDR = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
export const WSOL_ADDR = "0xd31a59c85ae9d8edefec411d448f90841571b89c";

export const PUBKEY: [string, string] = ["0x453bb8238f3ec00dbdf9783e2f3c69a754beeab0954c08639521957cfefafabb", "0x1995eab0d6a762169daa00ba6a7b47194945d4c10efa0e38b682920141b0a2ac"];
export const R = "0x71231bb60a42e53c905c19a7753273b345e3be4b46de5655eead13c7f32a4c38";
export const S = "0x18c6ee84cdc92d9bbb9d1186260a74650cd318d217f125e00e164bdef76bafd3";
export const MSGHASH = "0x3c6da7e2ade483ae7c72faf20af0147467047846ddc14eef02c8fb2685cbe279";

export const GROTH16_SUBQUERY = [
  "29c0a3411480f23aeaa644e2a26d00a218110df6e5d9e1831d23e28251e1ac00",
  "9a782e96fe87646508b878982fc7f8832f03b238e7b9c7eb99673cb2caa95400",
  "8edbd2e52ed5da1a974db1113de3772656df00e4132bce310b9b6b661502a400",
  "c86325c67a2d067fffc2c31ce2a2324f52bb4f2d00ed9ed4473a44b8bb5b5c00",
  "3e7be4f7956d9a3906837163b153bcf42e6c4aca16f7a08bc7324d2f63c56b00",
  "ae3b8e602bee4669c9f2b9647f724db127bb7fd6a622c7362b12549ed9ed8f00",
  "869f5362385b2fa40a1fa1879c638b2e0ac2abc44235233c219283ecb1620700",
  "606d51bda75d3913000000000000000000000000000000000000000000000000",
  "8101000000000000000000000000000000000000000000000000000000000000",
  "0500000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "50ad449eb71c1fa9c08d5f8b5347fdb520684d44ff266a169bdf7f6346490f2a"
].map((x) => "0x" + x);

export const sourceChainId = 1;
export const k = 14;
export const vkey = [
  "be9df5238dceff54fa804e4595ec681b5b531469372c90a4c66e54f7838ce20f",
  "c04b25057d0bddf35d4542077516abb76445b8e745a457e3ccc1bf9aac2ba406",
  "09fb99633315342c07ddd4bab72cfa9e89824e909314cf31f75e13ee24fb2b47",
  "2d1e39c178c1c193eb329019dddfd310f4bb6e4c8907219b70e24db8b1802047",
  "0000000000000000000000000000000000000000000000000000000000000080",
  "0000000000000000000000000000000000000000000000000000000000000080",
  "0000000000000000000000000000000000000000000000000000000000000080",
  "c794ad62c739a4980719c91c986c3528cf18aebccde48d8b6398e77dd4780864",
  "33d9164d0bfa56aac8389cbe7f54261ca943344764389241dcd95570181cfd1d",
  "22e4c62aacfc240ed0553bfad00122ba8c7627c870c739f3f818584e066a8b1f",
  "841485e0a9f109688bdc4f5ff851d9e2e44833ae573456742c1237322e938542",
  "79a62f1cc2f1440cc9fdcd534b612a49da4b6139bbed8cf53a26f4568ac3f567",
  "7890b747b8190cb4366ce2ebd5d3234ea4ccc35c6da003af62d93077f1d19264",
  "9b11a4f0f83422d5403d4b69c7f32be55e733a56096911fa1ab95342b6f3110c",
].map((x) => "0x" + x);
export const computeProof =
  "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67000000000000000000000000b392448932f6ef430555631f765df0dfae34eff3000000000000000000000000000000000000000000000000000000000092a6530000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad0d3d3dcfc9f6777cc5f4fe79a4a4bc394480c91776451fed0e53bee304e6ba51d9b1c84f81c7cfa5df53cd495afe8078e18938210082118baa078edad02e3a101188b835fce8eaf682dfa6dffeb9b1fad28dd4bf4535fd901260a282821fe41f86997c07c4c10fa50fdb973395fc27f0a423982501bf052607983874129f5d08b9454b6dff63d23697664a22703985abf0dcbf206ae26ad893f3452f161cf70a8f57efff4fdade9b2b9addf115afd14363f621931499067e144aca1392102e2e9c3410bf7f26aa6aa4b65c58612de327a3fc811d2577b6d284bb3507cd5eb004097987cc32b3e17772f8d6b45c6905a80c3655a9d3a9e27d407672100188b4184b03335ab8ba1cad7fddc305488cef6b1c1764f1a1067e2eb38c3d2b57abb5217981d402e02d67f82661d6d45fe5dfe629f4087135471f9f34cee61f20026f6fa000762da1318e2db4606154b97758b7cc0e390507730abfdf31095fc2b8452ab9e57acf3332739917e7b6796caa04bc722b2c06613a8a583b98af7d4578700a4ce009ea1cb0344b62146421099dd9382dd3109400373528e0a54241c50f36418ff058add2bff589bdc5c717efd96cdf949871d9615acc8d9c2f13570c5c14282a5f8b37cd2c68945b7e0211e221dea1c8648ea225a0f8247f5de75d7c734817a4a0a52a38a83ddefe77175fadaa50c8e815f22532c6b3a2a36b1606fe564c2e32f2767f878c952154d00d92b99034c443db9f84edeaf5cce82a19343e272706f59d193f070c1be07ea0aa8cb452773c0e205249e5b7e3726c6b4fb23c06e02dc355d45e3ec238e9dc64e5a1590a59daf8b72b666467de6e1bc82d8fe04fe42744bd44e29184cba80bff8831c358e9f3c7fac336a5ac0619b5f3c8ce0e83d407856b62d904d83194d0d6a4b306e54716a9612da94162fac8b2bfa0050075a42b9413b0ffe068c1d6f03747c456df76de07fb56768ab193beea54b1e0e8957a14f8658b5aeb63d22b80aa4ed5b403efa298d83771578535de585d2a3980781a2cd86fdf043feb8d862b78efa9835eee4d0db24fa3f2ea2280ab1b6da4983f6d28245997cbaaf391eacf503b5fcadf751a4d75898bf0f83d83b1e8ed8ad755451dd1dd2540b86bb86e1fdc6564d63f323fda56df4fb2bb7120d8cccc956a33e00141cd5d6b8860b46e7b29325b2b5f2f13f62ab1b33920210d9a8f4fb577b12d0731d08be9974a029c170a0408cfbc1da837a8bca104a6294d8caad889e585b51eab00646615e9b06cfdd9d72e4086a96e58438d4e7d2ee11f5adccc3b4a5269206f5f269909f9d308858b80f28f91f25141f95f3a51071923b42a706439be350bdd95d9ebc8fc3bb4301359ea34b6e3604afb0b0bd4416b575ff6b34eeee8f10f500e126fa83c86e068eed8bb643ae06fec29e5e6f45d392e2a519ae431622c263ba38665a6f6c91cd77833afd6c0fa7257a92db8a5c7de33f6a2db87806f2f086a9d0fdc54a74d150020943fcde74ce368d49cfe3316e8430193a9daf7bc4a2c3382c45dd107096d00c7b5ad1d63a94c4e27f273916474abbfd61cf90aec811ea5fb074a47130df2c3c9e8c8b8db955898eb8dfe63b4803f5ecad1b9b88a6709000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9f5fec449c496a0cfdccc0a4bc5ad39e6e9dec27516330beb88e95175b0ba008833e17e67438ab42a9f760c073534980091ef03ab7118d164a2e653f53d2e2fb54bcdf449421cb84757ec0bc29c04ea80f6b2bc456f40f67dc8c561991d5507414d96c2f2c151f486f6a9326278099e089579e8c3fc9b975be2ace0e43b73020c1c43dbb2e52d32d65d9de7aa89b3557aad08c678165694a9b904cf0e9fd62d94c2ca61c3520233bed1d8233a50f9e2b80992e8685c2dfa6dcc5aa5c918301764eea6e00f5ee1c23616df6204156a57596f1a341d4f4154e6431cfb1da5fc01556c7610642692910980aabdeb11b956505bd72a7efa7e7365f0ce257fc00a0f6a44e829903c83c338fe9a621318ad3eb1e89e5216da6893d3e824f7781c710c12b5252f195ac2470f859d2960c7288e422f5c2a0cfa84897d70d9b705a27022a6d01c3b1fc45fe17221190cc4aef7a1ada82f13be0ef40112c952fe6673cf220ef543aa8547b3f29c3248c21703fdbe1b748c92d78e67f06128884bf31ac417afb77a74f3d1d66619c9b9dc32e31d949db968c005371bded9151d90269fb82eb7462b21a3070dfa50bf5ec1006e1acb42bf1a8fba538eda2aba80e6373b01021fe46978631e8364b050693093449ef69e0783e12349ca6f3d5f07ed3712460c6c7003c8c8f92ed3c6775ff9ada5b25a14438f50b7b4611144281c662c43a307162bffbc70b021dda97fa44e33e04b01e22518f1dca2635381220e13498dc62f6a4df001951c0c73354193815cba74b3acd0b4eda030ae404af0c2246ab9a52d25bd6f4f831cb073a22b1510499373d72ed277b3b4d2a12411f8318a1b9330095ce731d4eb0327cd92878dd258b8bc9a3ac56d4685532397b6ef859f5399ae13dcd2787bd231179e82588f2e88ccda78a9770818056cc2bdec258cd0395e8f2575e9fe9185ff7261a43e6d76103ef5fb8fe7db920b3754f6cebb5b6874448e01c3c2ce1195e5518cd53e822f2b5470841a21bc8c7c16c35710b1476f2276811499fcdd6a73b6bcd6dc5f214487fdc8c63a9a777c3db8baf46493579e14d36b1b6880df426daeecd3d1bdd48beed6ba129ed866161363352da2a6c50c2c91431e69ba703c269df8f900312577fbd1095c8cdc457c5c7ce18130565f1ebdd1a617";
export const resultLen = 2;

export const target = "0xB392448932F6ef430555631f765Df0dfaE34efF3";
export const extraData = "0x1234";

export const caller = target;
export const refundee = "0xf591C4c1e179A5E16407116882f7F8a524D51d14";

export const maxFeePerGas = "0x05d21dba00"; // 25gwei
export const callbackGasLimit = 200000; // 200k
export const overrideAxiomQueryFee = "0x2000";

export const dataSubqueries: DataSubquery[] = [
  {
    type: DataSubqueryType.Header,
    subqueryData: {
      blockNumber: BLOCK_NUMBER,
      fieldIdx: HeaderField.Miner,
    } as HeaderSubquery,
  },
  {
    type: DataSubqueryType.Header,
    subqueryData: {
      blockNumber: BLOCK_NUMBER + 1,
      fieldIdx: HeaderField.GasLimit,
    } as HeaderSubquery,
  },
  {
    type: DataSubqueryType.Account,
    subqueryData: {
      blockNumber: BLOCK_NUMBER,
      addr: WETH_ADDR,
      fieldIdx: AccountField.CodeHash,
    } as AccountSubquery,
  },
  {
    type: DataSubqueryType.Storage,
    subqueryData: {
      blockNumber: BLOCK_NUMBER,
      addr: WETH_ADDR,
      slot: bytes32(1),
    } as StorageSubquery,
  },
  {
    type: DataSubqueryType.Transaction,
    subqueryData: {
      blockNumber: 15060942,
      txIdx: 114,
      fieldOrCalldataIdx: TxField.To,
    } as TxSubquery,
  },
  {
    type: DataSubqueryType.Receipt,
    subqueryData: {
      blockNumber: 15060942,
      txIdx: 114,
      fieldOrLogIdx: 0,
      topicOrDataOrAddressIdx: 0,
      eventSchema: "0x255910aca2752f3c05fcb4a54d3d8d93bb809a9c8cc215d5eed2504d44cbd865",
    } as ReceiptSubquery,
  },
  {
    type: DataSubqueryType.SolidityNestedMapping,
    subqueryData: {
      blockNumber: BLOCK_NUMBER,
      addr: UNI_V3_FACTORY_ADDR.toLowerCase(),
      mappingSlot: bytes32(5),
      mappingDepth: 3,
      keys: [bytes32(WETH_ADDR), bytes32(WSOL_ADDR), bytes32(10000)],
    } as SolidityNestedMappingSubquery,
  },
];
export const dataQuery: AxiomV2DataQuery = {
  sourceChainId: toBeHex(sourceChainId, 8),
  subqueries: dataSubqueries,
};
export const dataQueryHash = getDataQueryHashFromSubqueries(sourceChainId, dataSubqueries);

export const computeQuery: AxiomV2ComputeQuery = {
  k,
  resultLen,
  vkey,
  computeProof,
};

export const callback: AxiomV2Callback = {
  target,
  extraData,
};

export const feeData: AxiomV2FeeData = {
  maxFeePerGas,
  callbackGasLimit,
  overrideAxiomQueryFee,
};

export const userSalt = "0x51416b72bd980c4fe62fb361a1abce1da5d70d6e8264221ad92796363284d1fe";