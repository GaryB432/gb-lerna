export interface RepoOptions {
  independent: boolean;
  packageName: string;
}

export interface PackageOptions {
  name: string;
}

export interface ModuleOptions {
  packageName: string;
  name: string;
  kind: string;
  test: boolean;
}
