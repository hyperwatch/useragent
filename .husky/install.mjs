// Installs the Git hooks (npm's prepare script), except where Husky isn't
// wanted (production, CI) or isn't installed (npm install --omit=dev)
if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
  process.exit(0);
}

try {
  const { default: husky } = await import('husky');
  console.log(husky());
} catch (error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') {
    throw error;
  }
}
