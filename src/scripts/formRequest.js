(function(){
	"use strict";

	var userForm = $('#userForm'),
		userName = userForm.find('input[name="userName"]'),
		userMail = userForm.find('input[name="userMail"]'),
		userText = userForm.find('textarea'),
		submit = userForm.find('input[type="submit"]');

	var requestModal = $('#modal2'),
		requestModalContent = requestModal.find('.modal__content');

	var template = {
		done: '<div class="req">' +
				'<div class="req__title">Thank you!</div>' +
				'<div class="req__row">Your message has been successfully sent</div>' +
				'<div class="req__row">Your ID: <span class="serverRequest"></span></div>' +
			  '</div>',
		fail: '<div class="req">' +
				'<div class="req__title">An error has occurred</div>' +
			  '</div>',
	};

	submit.on('click', submitClick);

	function submitClick(e){
		e.preventDefault();
		e.stopPropagation();

		$.get( "https://api2.esetnod32.ru/frontend/test/", {
			title: userName.val() || "Mish",
			email: userMail.val() || "ya@ya.ru",
			text: userText.val() || ""
		}).done(function(resp) {
			var result = JSON.parse(resp);
			setContentToModal(result.data);
		})
		.fail(function() {});
	}

	function setContentToModal(data){
		requestModalContent.html('');
		if(data){
			$(template.done).appendTo(requestModalContent);
			requestModal.find('.serverRequest').html(data.id);
		} else {
			$(template.fail).appendTo(requestModalContent);
		}
		requestModal.modal();
	}
})();