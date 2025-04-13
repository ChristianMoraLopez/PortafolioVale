// types/PortfolioContentFulTypes.ts
import { Asset as ContentfulAsset } from 'contentful';

// Define el tipo para TagLink
interface TagLink {
  sys: {
    type: 'Link';
    linkType: 'Tag';
    id: string;
  };
}

// Define AssetSys tipo
export interface AssetSys {
  space: {
    sys: {
      type: 'Link';
      linkType: 'Space';
      id: string;
    };
  };
  id: string;
  type: 'Asset';
  createdAt: string;
  updatedAt: string;
  environment: {
    sys: {
      id: string;
      type: 'Link';
      linkType: 'Environment';
    };
  };
  revision: number;
  locale: string;
}

// Define el tipo para los campos combinados
export type CombinedFields = {
  title: string;
  description?: string;
  technic?: string;
  file: {
    url: string;
    contentType: string;
    details: {
      size: number;
      duration?: number;
    };
  };
};

// Define ContentItem tipo
export interface ContentItem {
  category: string;
  type: 'image' | 'video';
  metadata: {
    tags: Array<{
      sys: {
        type: 'Link';
        linkType: 'Tag';
        id: string;
      };
    }>;
  };
  sys: {
    id: string;
    type: 'Asset';
    createdAt: string;
    updatedAt: string;
    locale: string;
    space: {
      sys: {
        type: 'Link';
        linkType: 'Space';
        id: string;
      };
    };
    environment: {
      sys: {
        type: 'Link';
        linkType: 'Environment';
        id: string;
      };
    };
    revision: number;
  };
  fields: {
    title: string;
    description: string;
    technic?: string;
    file: {
      url: string;
      contentType: string;
      details: {
        size: number;
        duration?: number;
      };
    };
  };
}

// Extiende el tipo ContentfulAsset para incluir metadata
export interface ExtendedAsset extends ContentfulAsset {
  metadata: {
    tags: TagLink[];
  };
}

// Define VideoFields tipo
export type VideoFields = {
  title: string;
  description?: string;
  file: {
    url: string;
    contentType: string;
    details: {
      size: number;
      duration?: number;
    };
  };
};

// Define AssetFields tipo
export type AssetFields = {
  title: string;
  description?: string;
  technic?: string;
  file: {
    url: string;
    contentType: string;
    details: {
      size: number;
    };
  };
};

// Define ParagraphContent tipo
export type ParagraphContent = {
  data: Record<string, never>;
  content: Array<{
    data: Record<string, never>;
    marks: Array<Record<string, never>>;
    value: string;
    nodeType: 'text';
  }>;
  nodeType: 'paragraph';
};

// Define ContentfulSpace tipo
interface ContentfulSpace {
  sys: {
    type: 'Link';
    linkType: 'Space';
    id: string;
  };
}

// Define ContentfulEnvironment tipo
interface ContentfulEnvironment {
  sys: {
    type: 'Link';
    linkType: 'Environment';
    id: string;
  };
}

// Define ContentfulContentType tipo
interface ContentfulContentType {
  sys: {
    type: 'Link';
    linkType: 'ContentType';
    id: string;
  };
}

// Define ContentfulData tipo
export interface ContentfulData {
  metadata: {
    tags: string[];
  };
  sys: {
    space: ContentfulSpace;
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    environment: ContentfulEnvironment;
    revision: number;
    contentType: ContentfulContentType;
    locale: string;
  };
  fields: {
    images?: ContentItem[];
    videos?: ContentItem[];
    title?: string;
    description?: string;
    technic?: string;
  };
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  thumbnail: ContentItem | null;
}

export interface PortfolioData {
  gallery: ContentItem[];
  initialPortfolio: {
    heroImage: ContentItem | null;
    backgroundVideo: ContentItem | null;
    services: {
      artistic: ContentItem[];
      social: ContentItem[];
      bodypaint: ContentItem[];
      editorial: ContentItem[];
    };
  };
  serviceCategories: {
    id: string;
    title: string;
    description: string;
    thumbnail: ContentItem | null;
  }[];
}