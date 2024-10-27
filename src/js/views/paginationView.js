import View from "./view.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
	_parentElement = document.querySelector(".pagination");

	// Publisher
	addHandlerClick(handler) {
		this._parentElement.addEventListener("click", function (e) {
			const btn = e.target.closest(".btn--inline"); // Select the closest button element to the clicked element, searching up the tree for a parent (if you clicked on the span, use or svg).

			if (!btn) return;
			// console.log(btn);

			const gotoPage = +btn.dataset.goto;
			// console.log(gotoPage);

			handler(gotoPage);
		});
	}

	_generateMarkup() {
		const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
		// console.log(numPages);

		const currentPage = this._data.page;
		// console.log(currentPage);

		// Page 1, and there are other pages
		if (currentPage === 1 && numPages > 1) {
			return this._generateMarkupButton(currentPage, "next");
		}
		// Last page
		if (currentPage === numPages && numPages > 1) {
			return this._generateMarkupButton(currentPage, "prev");
		}

		// Other page
		if (currentPage > 1 && currentPage < numPages) {
			return (
				this._generateMarkupButton(currentPage, "prev") +
				this._generateMarkupButton(currentPage, "next")
			);
		}

		// Page 1, and there are NO other pages
		return "";
	}

	_generateMarkupButton(currentPage, direction) {
		const pageToGo = `${direction === "prev" ? currentPage - 1 : currentPage + 1}`;
		// console.log(pageToGo);
		return `
      <button data-goto="${pageToGo}" class="btn--inline pagination__btn--${direction}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${direction === "prev" ? "left" : "right"}"></use>
        </svg>
        <span>Page ${pageToGo}</span>
      </button>
    `;
	}
}

export default new PaginationView();
