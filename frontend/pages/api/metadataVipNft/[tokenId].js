export default function handler(req, res) {
  // get the tokenId from the query params
  const tokenId = req.query.tokenId;
  const image_url =
    "https://gateway.pinata.cloud/ipfs/Qmeu9MQmuCubhtdxgjKzUMELRSCSr2ZaFBDjWXA5gKT6Qw";
  // The api is sending back metadata for a Crypto DAO NFT Member
  // To make our collection compatible with Opensea, we need to follow some Metadata standards
  // when sending back the response from the api
  // More info can be found here: https://docs.opensea.io/docs/metadata-standards
  res.status(200).json({
    name: "Crypto DAO Vip #" + tokenId,
    description:
      "Crypto DAO Vip is a collection that allows you vote in proposals and create proposals in the NFT DAO Community",
    image: image_url,
  });
}
