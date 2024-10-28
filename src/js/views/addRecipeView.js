import View from "./view.js";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
	_parentElement = document.querySelector(".upload");

	_window = document.querySelector(".add-recipe-window");
	_overlay = document.querySelector(".overlay");
	_btnOpen = document.querySelector(".nav__btn--add-recipe");
	_btnClose = document.querySelector(".btn--close-modal");

	constructor() {
		super();
		this._addHandlerShowWidow();
		this._addHandlerHideWidow();
	}

	// Handle submitting the form
	addHandlerUpload(handler) {
		this._parentElement.addEventListener("submit", function (e) {
			e.preventDefault();
			const dataArr = [...new FormData(this)];

			// Convert array of entries (key-value pairs) into an object!!!
			const data = Object.fromEntries(dataArr);
			handler(data);
		});
	}

	_toggleWindow() {
		this._overlay.classList.toggle("hidden");
		this._window.classList.toggle("hidden");
	}

	// ATTN. The 'this' keyword inside of a handler points to the element it is bound to. In this case to _btnOpen!!!
	// We need to bind the 'this' keyword to the right object
	_addHandlerShowWidow() {
		this._btnOpen.addEventListener("click", this._toggleWindow.bind(this));
	}

	_addHandlerHideWidow() {
		this._btnClose.addEventListener("click", this._toggleWindow.bind(this));
		this._overlay.addEventListener("click", this._toggleWindow.bind(this));
	}

	_generateMarkup() {}
}

export default new AddRecipeView();
