### Transforms

 - pre-load translations that have been done
 - read data files (.yaml,.yml)
 - add TR strings to dictionary
 - add MD rendered strings to dictionary


> Add whitelisted keys to language dictionary

```js

// lang.locale.pageKey.propertyKey

var lang = {
  'en': {
    'about': {
      'foo': 'bar'
    }
  },
  'de': {
    'about': {
      'foo': 'bar-de'
    }
  },
  'jp': {
    'about': {
      'foo': 'bar-jp'
    }
  }
}
```

### Page front-matter

 - middleware to add TR strings and MD strings to dictionary
 - middleware to replace TR strings with whitelisted keys
