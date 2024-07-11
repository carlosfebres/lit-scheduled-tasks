# 🔥 LIT Scheduled Tasks Worker 🔧

Adding a recipient for auto-top-up is done by opening a pull request that adds your account and token details to the appropriate file in this directory.
There is 1 file per supported network:

### [Habanero](./recipient_list_habanero.json)

### [Manzano](./recipient_list_manzano.json)

Note that entries must match the following shape:

```json
{
  "daysUntilExpires": 10,
  "recipientAddress": "<your PKP address here>",
  "requestsPerSecond": 10
}
```

`recipientAddress` is required. `daysUntilExpires` and `requestsPerSecond` are optional, and will default to `10` if you do not provide them.
