const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["s.gravatar.com"],
  },
  serverless: {
    // Increase timeout for the serverless function
    timeout: 30, // timeout duration in seconds
    // Other serverless function configurations
    // ...
  },
}

module.exports = nextConfig
