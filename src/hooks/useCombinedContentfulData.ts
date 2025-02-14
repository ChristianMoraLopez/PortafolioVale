import useContentfulData from "@/hooks/usePortfolioPictures";
import { ContentItem, ExtendedAsset } from "@/types/PortfolioContentFulTypes"; // Ensure correct paths
import { AssetFields, AssetSys, VideoFields, ContentfulData, CombinedFields } from "@/types/PortfolioContentFulTypes";
import { useEffect } from "react";


const useCombinedContentfulData = (): {
  combinedData: ContentItem[];
  loading: boolean;
  error: Error | null;
} => {
  const {
    data: firstData,
    loading: firstLoading,
    error: firstError,
  } = useContentfulData("1ebZQKrlJyZH30jRAj7bKe");
  const {
    data: secondData,
    loading: secondLoading,
    error: secondError,
  } = useContentfulData("1aFPiWEyvcq0amHhH6SXvq");

  useEffect(() => {
    if (secondData) {
      console.log("First Entry Data:", firstData);
      console.log("Videos in first entry:", secondData.fields.videos);
    }
  }, [secondData]);

  const combinedData: ContentItem[] = [
    ...(firstData?.fields.images || []).map((img: ExtendedAsset): ContentItem => ({
      ...img,
      category: firstData?.fields.technic || "Uncategorized",
      type: "image" as const,
      metadata: {
        tags: img.metadata?.tags || [], // Ensure tags is an array of TagLink
      },
      sys: {
        ...img.sys,
        locale: img.sys.locale || "en-US", // Asignar un valor por defecto si es undefined
      } as AssetSys, // Asegúrate de que sys es compatible con AssetSys
      fields: img.fields as AssetFields | VideoFields, // Handle type discrimination
    })),
    ...(secondData?.fields.images || []).map((img: ExtendedAsset): ContentItem => ({
      ...img,
      category: secondData?.fields.technic || "Uncategorized",
      type: "image" as const,
      metadata: {
        tags: img.metadata?.tags || [], // Ensure tags is an array of TagLink
      },
      sys: {
        ...img.sys,
        locale: img.sys.locale || "en-US", // Asignar un valor por defecto si es undefined
      } as AssetSys, // Asegúrate de que sys es compatible con AssetSys
      fields: img.fields as AssetFields | VideoFields, // Handle type discrimination
    })),
  ];

  
// Manejar los datos de video si están disponibles
const handleVideoData = (data: ContentfulData) => {
  if (data?.fields?.videos && Array.isArray(data.fields.videos)) {
    console.log("Processing videos:", data.fields.videos); // Para debug
    const videoItems = data.fields.videos.map((video: ExtendedAsset) => ({
      ...video,
      category: data.fields.technic || "Uncategorized",
      type: "video" as const,
      sys: {
        ...video.sys,
        locale: video.sys.locale || "en-US",
      } as AssetSys,
      fields: {
        title: video.fields.title,
        description: video.fields.description || "",
        file: video.fields.file,
        contentType: video.fields.file?.contentType // Asegúrate de que esto existe
      } as CombinedFields,
    }));
    
    console.log("Processed video items:", videoItems); // Para debug
    combinedData.push(...videoItems);
  }
};

  handleVideoData(firstData!);
  handleVideoData(secondData!);

  const loading = firstLoading || secondLoading;
  const error = firstError || secondError;

  return {
    combinedData,
    loading,
    error,
  };
};

export default useCombinedContentfulData;
