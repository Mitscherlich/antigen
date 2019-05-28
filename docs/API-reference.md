# API Reference

The default entpoint if you run this locally is `http://localhost:3000`. For my demo, is `https://api.mitscherlich.me/antigen`.

## Users

### User sign up

```
POST /user/signup
```

Sign up a brand new user.

#### Parameters

| **Name** | **Type** | **Description**        |
| :------: | :------: | :--------------------- |
|  `name`  | `String` | user name              |
| `image`  | `String` | base64 encrypted image |

#### Response

A UUID v4 token for user

```
e3e9e0ff-aae1-49f8-ade3-9a3af79984de
```

### Get user token

```
GET /user/:name/token
```

Get a user's token

#### Parameters

| **Name** | **Type** | **Description**        |
| :------: | :------: | :--------------------- |
| `image`  | `String` | base64 encrypted image |

#### Response

```json
{
  "success": true,
  "token": "<uuid>",
  "message": "ok"
}
```

#### Authorize a user

```
POST /user/auth
```

It's quite similar to get user's token but in `POST` method and no parameters in url.

And this methods has side effects that will save the image this time as `user.last` for manual inspection.

#### Parameters

| **Name** | **Type** | **Description**        |
| :------: | :------: | :--------------------- |
| `token`  | `String` | user token             |
| `image`  | `String` | base64 encrypted image |

#### Response

```json
{
  "success": true,
  "token": "<uuid>",
  "message": "ok"
}
```

## Gates

### Fetch gates list

```
GET /gates
```

#### Response

```json
[
  {
    "id": "<uuid>"
  }
]
```

Returns gates' ID list. Gate's ID is also in UUID v4 format.

### Open a gate

```
GET /gate/:id/open
```

Waring: for debug only. This will open a gate directly. Consider disable or remove it in production mode.

#### Response

```json
{
  "success": true,
  "message": "gate has been opened"
}
```

### Authorize and open a gate

```
POST /gate/:id/auth
```

#### Parameters

| **Name** | **Type** | **Description**        |
| :------: | :------: | :--------------------- |
| `token`  | `String` | user token             |
| `image`  | `String` | base64 encrypted image |

#### Response

```json
{
  "success": true,
  "message": "gate has been open"
}
```

### Authorize and open a gate (legacy)

```
POST /gate/auth
```

This is quite similar to the same up but `id` in the parameters and only return `true` or `false` for user authorization result. Currentlly used in mobile application and not recommend for new applications.

#### Parameters

| **Name** | **Type** | **Description**        |
| :------: | :------: | :--------------------- |
|   `id`   | `String` | gate id                |
| `token`  | `String` | user token             |
| `image`  | `String` | base64 encrypted image |

#### Response

```json
true
```

## General APIs

### Face detection

```
POST /api/face/detection
```

#### Parameters

| **Name** | **Type** | **Description**        |
| :------: | :------: | :--------------------- |
| `image`  | `String` | base64 encrypted image |

#### Response

```json
{
  "count": 1,
  "faces": [
    {
      "x": 113,
      "y": 66,
      "width": 72,
      "height": 86
    }
  ]
}
```

### Face landmarks

```
POST /api/face/landmarks
```

#### Parameters

| **Name** | **Type** | **Description**        |
| :------: | :------: | :--------------------- |
| `image`  | `String` | base64 encrypted image |

#### Response

```json
{
  "count": 1,
  "faces": [
    {
      "x": 113,
      "y": 66,
      "width": 72,
      "height": 86,
      "points": [
        { "x": 131.15, "y": 104.488 },
        { "x": 158.064, "y": 101.253 },
        { "x": 144.462, "y": 118.552 },
        { "x": 138.1, "y": 135.026 },
        { "x": 157.969, "y": 132.387 }
      ]
    }
  ]
}
```

### Face identify

```
POST /api/face/identify
```

#### Parameters

| **Name** | **Type** | **Description**        |
| :------: | :------: | :--------------------- |
| `image`  | `String` | base64 encrypted image |

#### Response

```json
{
  "similars": [0.210629, 0.219952, 0.999999, 0.148808],
  "count": 1,
  "faces": [
    {
      "x": 113,
      "y": 66,
      "width": 72,
      "height": 86,
      "points": [
        { "x": 131.15, "y": 104.488 },
        { "x": 158.064, "y": 101.253 },
        { "x": 144.462, "y": 118.552 },
        { "x": 138.1, "y": 135.026 },
        { "x": 157.969, "y": 132.387 }
      ]
    }
  ]
}
```

If no user in the database, this will faceback to [Face landmarks](#face-landmarks).

## QR Code

A very simple way to generate a qr code with provided content.

```
GET /qrcode
```

#### Parameters

| **Name**  | **Type** | **Description** |
| :-------: | :------: | :-------------- |
| `content` | `String` | qr code content |

#### Response

```
data:image/png;base64,...
```

QR code image will return in base64 format.
