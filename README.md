# Identicon API

This project is forked from [aarohmankad/identicon-api](https://github.com/aarohmankad/identicon-api) which stemmed from the need to include dynamic, default identicons for new users of [UNUM](http://unum.la/). It was inspired by the amazing work of [jdenticon](https://github.com/dmester/jdenticon), a javascript module that allowed the generating of identicons.

This project is a serverless implementation of the original identicon-api, and is hosted on [Deno Deploy](https://deno.com/deploy).

## Usage

```html
<img src="https://identicon.02420.dev/[username]/[size]?format=(svg|png)&config=">
```

- `username`: This doesn't have to be a username, just any string. Hashing is done server-side using SHA-256.
- `size`: This is the size of the image you would like returned. For now, the API only returns squares, so `size` is any natural number.
- `format`: This is the format you would like the image returned in, `svg` or `png`. (Default: `svg`)
- `config`: This is the same config hash generated by [Jdenticon Icon Designer](https://jdenticon.com/icon-designer.html) for generating custom icons.


## Contributing

If you would like to contribute to this project, please feel free to fork this repository and submit a pull request, or open an issue.

## Links

- View source code [aryan02420/identicon-api](https://github.com/aryan02420/identicon-api)
- Deployed at [identicon.02420.dev](https://identicon.02420.dev)

