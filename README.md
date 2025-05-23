# matrix-invite-cli

## usage
```sh
node invite.js [--dry-run] [--verbose] <username> <password> <email>
```

## config.yaml
```yaml
smtp:
  host: smtp.sendgrid.net
  port: 587
  secure: false
  auth:
    user: apikey
    pass: your_password
from: noreply@b-shock.org
element:
  url: https://matrix.b-shock.org
homeserver:
  url: https://synapse.b-shock.org
```
