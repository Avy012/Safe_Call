@echo off
"C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.14.7-hotspot\\bin\\java" ^
  --class-path ^
  "C:\\Users\\User\\.gradle\\caches\\modules-2\\files-2.1\\com.google.prefab\\cli\\2.1.0\\aa32fec809c44fa531f01dcfb739b5b3304d3050\\cli-2.1.0-all.jar" ^
  com.google.prefab.cli.AppKt ^
  --build-system ^
  cmake ^
  --platform ^
  android ^
  --abi ^
  arm64-v8a ^
  --os-version ^
  24 ^
  --stl ^
  c++_shared ^
  --ndk-version ^
  26 ^
  --output ^
  "C:\\Users\\User\\AppData\\Local\\Temp\\agp-prefab-staging12526114999046276679\\staged-cli-output" ^
  "C:\\Users\\User\\.gradle\\caches\\8.10.2\\transforms\\0f839437195569227022e709030e837c\\transformed\\react-android-0.76.9-debug\\prefab" ^
  "C:\\Users\\User\\Documents\\GitHub\\Safe_Call\\Safe_call_app\\android\\app\\build\\intermediates\\cxx\\refs\\react-native-reanimated\\671q704a" ^
  "C:\\Users\\User\\.gradle\\caches\\8.10.2\\transforms\\835c7fc77adcc806d35d2238e408e225\\transformed\\hermes-android-0.76.9-debug\\prefab" ^
  "C:\\Users\\User\\.gradle\\caches\\8.10.2\\transforms\\1957b0db02baa50e26af4d5b92e700f6\\transformed\\fbjni-0.6.0\\prefab"
