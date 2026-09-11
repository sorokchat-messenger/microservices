type BasicService = {
  name: string;
  url: string;
};

type StringService = {
  path: string;
  package: string;
};

type ArrayService = {
  path: string[];
  package: string[];
};

export type Service = BasicService & (StringService | ArrayService);
