export default async (request, context) => {
  const response = await context.next();
  response.headers.set("X-Neural-Shield", "Active");
  return response;
};