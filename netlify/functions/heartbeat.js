exports.handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ status: "STABLE", node: "AWS-LAMBDA-SYNC" })
});