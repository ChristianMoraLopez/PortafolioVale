import { Asset as ContentfulAsset } from 'contentful';

// Define el tipo adecuado para Link, si es necesario
interface TagLink {
  sys: {
    type: 'Link';
    linkType: 'Tag';
    id: string;
  };
}

// Extender el tipo Asset de Contentful para incluir metadata
export interface ExtendedAsset extends ContentfulAsset {
  metadata: {
    tags: TagLink[]; // Cambiado a usar el tipo `TagLink` que incluye las propiedades requeridas
  };
}

// Definición para los campos de video
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

// Definición para los campos de asset general (imágenes y otros archivos)
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

// Definición para los assets (tanto video como otros tipos)
export type Asset = {
  sys: {
    type: 'Link';
    linkType: 'Asset';
    id: string;
  };
  fields?: AssetFields | VideoFields; // Campos opcionales
  metadata: {
    tags: TagLink[]; // Asegúrate de que `metadata` esté aquí también
  };
};

// Definición para el contenido de un párrafo
export type ParagraphContent = {
  data: unknown;
  content: Array<{
    data: unknown;
    marks: string[];
    value: string;
    nodeType: 'text';
  }>;
  nodeType: 'paragraph';
};

// Definición principal para los datos de Contentful
export type ContentfulData = {
  metadata: {
    tags: string[];
  };
  sys: {
    space: {
      sys: {
        type: 'Link';
        linkType: 'Space';
        id: string;
      };
    };
    id: string;
    type: 'Entry';
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
    contentType: {
      sys: {
        type: 'Link';
        linkType: 'ContentType';
        id: string;
      };
    };
    locale: string;
  };
  fields: {
    title: string;
    images: ExtendedAsset[]; // Cambiado a `ExtendedAsset` para incluir `metadata`
    description: {
      data: unknown;
      content: ParagraphContent[];
      nodeType: 'document';
    };
    date: string;
    client: string;
    servicesProvided: string;
    video: ExtendedAsset; // Cambiado a `ExtendedAsset` en lugar de un array
    location: string;
    technic: string; // Asegúrate que esto se use en su contexto adecuado
  };
};
