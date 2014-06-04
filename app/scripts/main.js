"use strict";

// Model
var ToDoItem = Backbone.Model.extend({
	idAttribute: '_id',
	defaults: {
		toDo: ''
	}
});

// Collection
var ToDoCollection = Backbone.Collection.extend({
	model: ToDoItem,
	url: 'http://tiny-pizza-server.herokuapp.com/collections/gingerrific'
});

// Results View
var ToDoView = Backbone.View.extend({

	renderTemplate: _.template($('.to-do-line-item').text()),
	editTemplate: _.template($('.edit-line-item').text()),

	events: {
		'click .remove-image'	: 'removeLine',
		'click .to-do-line'		: 'editLine',
		'keydown .edit-line'	: 'makeChanges',
		'click .status-image'	: 'markDone'
	},

	initialize: function () {
		this.listenTo(this.model, 'change', this.render);
		$('.item-container').append(this.el);
		this.render();
	},

	render: function () {
		var renderToDo = this.renderTemplate(this.model.attributes);
		this.$el.html(renderToDo);
	},

	removeLine: function () {
		this.model.destroy()
		this.remove()
	},

	editLine: function () {
		var renderToDo = this.editTemplate(this.model.attributes);
		this.$el.html(renderToDo);
	},

	makeChanges: function (key) {
		var changedItem = $('.edit-line').val();
		if (key.keyCode == 13) {
			this.model.set('toDo', changedItem);
			this.model.save();
		}
	},

	markDone: function () {
		this.$el.find('.status-image').toggleClass('completed');
		this.$el.find('.to-do-line').toggleClass('strikethrough')
	}

});


// Input Bar View
var InputView = Backbone.View.extend ({

	initialize: function () {
		this.toDoList = new ToDoCollection ();
		this.toDoList.fetch();

		this.listenTo(this.toDoList, 'add', function(todo){
			new ToDoView({model: todo})
		});

		var that = this;

		$('.next-item').click(function(){
			that.createNewToDo()
		})

		$('.up-next').keypress(function(key){
			if (key.keyCode == 13) {
			that.createNewToDo();
			}
		})

		$('.up-next').focus();
	},

	createNewToDo: function () {
		var item = $('.up-next').val();
		this.toDoList.add({toDo: item}).save();
		$('.up-next').val('');
	},

});


new InputView();

