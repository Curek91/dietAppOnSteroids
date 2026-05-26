// Local entry point for Metro to resolve from apps/mobile/.
// Without this, Expo CLI generates `..\..\node_modules\expo-router\entry`
// (the package gets hoisted to root by npm workspaces) and Metro's URL
// resolver fails to walk up on Windows. Importing here keeps the path
// inside apps/mobile and lets Metro's nodeModulesPaths find expo-router.
import "expo-router/entry";
