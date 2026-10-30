// A splat to display: either a file picked by the user or a hosted file by URL
export type SplatSource = File | { name: string; url: string }

export const SUPPORTED_EXTENSIONS = [".ply", ".splat", ".spz", ".sog"]

export const DEMO_SPLAT: SplatSource = {
  name: "Gårdstånga Kyrka",
  url: `${import.meta.env.BASE_URL}demo/gardstanga-kyrka.sog`,
}

export function isSupportedSplatFile(file: File) {
  const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
  return SUPPORTED_EXTENSIONS.includes(extension)
}
