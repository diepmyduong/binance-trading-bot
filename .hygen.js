module.exports = {
  helpers: {
    path: function(s)  {
      return s.split('/').map(n => this.inflection.camelize(n, true)).join('/')
    },
    import: function(name, path) {
      for (var i = 1; i < name.split('/').length; i++) {
        path = '../' + path;
      }
      return path;
    }
  }
}