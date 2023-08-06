# audio-searcher

- ローカルのオーディオファイルを探して楽に DJ するためのもの
- デプロイして使うつもりはない

```mermaid
graph LR
  subgraph "AudioSearcher Server"
    aa(Electron main)
    ab(Electron renderer)
    ac(Go Server)
  end

  subgraph "ローカルファイル"
    ba(オーディオファイル)
  end

  subgraph "ES Indexer"
    ca(CLI)
    cb(Elasticsearch)
  end

  aa -- GraphQL --> ac
  ab -- GraphQL --> ac
  ac -- Search --> cb
  ac -- Read --> ba
  ca -- Read --> ba
  ca -- Index --> cb
```
