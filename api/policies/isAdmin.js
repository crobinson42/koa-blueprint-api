module.exports = (ctx, next) => {
  if (!ctx.state.user || !ctx.state.user.isAdmin) throw new Error('Forbidden');

  return next();
};
