# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-16

### Added

- `StowryClient` class with async presigned URL generation
- `presignGet(path, expires?)` - generate presigned GET URL
- `presignPut(path, expires?)` - generate presigned PUT URL
- `presignDelete(path, expires?)` - generate presigned DELETE URL
- Isomorphic support: Web Crypto API with Node.js crypto fallback
- ESM and CommonJS dual builds
- TypeScript type definitions
- Node.js and browser test suites

[1.0.0]: https://github.com/sagarc03/stowryjs/releases/tag/v1.0.0
