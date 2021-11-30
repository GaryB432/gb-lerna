export interface RepoOptions {
  independent: boolean;
  packageName: string;
  skipInstall: boolean;
}

export interface PackageOptions {
  name: string;
}

export interface ModuleOptions {
  kind: string;
  name: string;
  packageName: string;
  test: boolean;
}

export interface InfoOptions {
  verbose: boolean;
}
