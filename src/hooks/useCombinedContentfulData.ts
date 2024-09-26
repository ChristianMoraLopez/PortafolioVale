import useContentfulData from "@/hooks/usePortfolioPictures";

const useCombinedContentfulData = () => {
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

  const combinedData = [
    ...(firstData?.fields.images || []).map((img) => ({
      ...img,
      category: firstData?.fields.technic || "Uncategorized",
    })),
    ...(secondData?.fields.images || []).map((img) => ({
      ...img,
      category: secondData?.fields.technic || "Uncategorized",
    })),
  ];

  const loading = firstLoading || secondLoading;
  const error = firstError || secondError;

  return {
    combinedData,
    loading,
    error,
  };
};

export default useCombinedContentfulData;