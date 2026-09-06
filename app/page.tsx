import AnniversaryExperience from "@/components/AnniversaryExperience";
import {
  anniversaryData,
  validateAnniversaryData,
} from "@/lib/anniversary-data";

validateAnniversaryData(anniversaryData);

/**
 * Homepage: wraps the splash -> content flow. The full configuration is
 * passed as a single object; every component reads from it. Media values
 * are Cloudinary public IDs and are resolved to signed delivery URLs
 * client-side.
 */
export default function Home() {
  return <AnniversaryExperience data={anniversaryData} />;
}