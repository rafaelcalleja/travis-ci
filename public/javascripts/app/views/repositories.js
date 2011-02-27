Travis.Views.Repositories = Travis.Views.Base.List.extend({
  name: 'repositories',
  selectors: {
    list: '#repositories'
  },
  collection_events: {
    'build:add': 'buildUpdated',
    'build:change': 'buildUpdated'
  },
  initialize: function (args) {
    _.bindAll(this, 'buildUpdated', 'updateStatus', 'repositorySelected');
    Travis.Views.Base.List.prototype.initialize.apply(this, arguments);
  },
  connect: function(collection) {
    Travis.Views.Base.List.prototype.connect.apply(this, arguments);
    collection.bind('change:selected', this.repositorySelected);
  },
  itemAdded: function() {
    Travis.Views.BaseList.prototype.itemAdded.apply(this);
    this.updateStatus();
  },
  collectionRefreshed: function() {
    Travis.Views.Base.List.prototype.collectionRefreshed.apply(this, arguments);
    this.element().updateTimes();
    this.updateStatus();
  },
  buildUpdated: function(item) {
    item = _.isFunction(item.repository) ? item.repository() : item;
    $('#repository_' + item.id, this.element).remove();
    this._renderItem(item);
    this.updateStatus();
  },
  repositorySelected: function(repository) {
    $('.repository', this.element()).removeClass('current');
    $('#repository_' + repository.id, this.element()).addClass('current');
  },
  updateStatus: function() {
    this.element().removeClass('active');
    _.each(this.collection.building(), function(repository) {
      $('#repository_' + repository.id, this.element()).addClass('active');
    }.bind(this));
  }
});
