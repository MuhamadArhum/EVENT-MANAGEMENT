// middleware/featureMiddleware.js
function featureMiddleware(requiredFeatures) {
  return (req, res, next) => {
    const userFeatures = (req.user.assignedFeatures || []).map(f => f.toString());
    const hasAccess = requiredFeatures.some(f => userFeatures.includes(f));

    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access Denied: Feature not assigned' });
    }
    next();
  };
}

module.exports = featureMiddleware;
