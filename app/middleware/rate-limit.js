const rateLimit = require('express-rate-limit');
// add ratelimit to limit the repeated request 
const ratelimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 6, // Limit each IP to 6 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = ratelimiter;