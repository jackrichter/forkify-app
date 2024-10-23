import View from "./view";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
	_parentElement = document.querySelector(".pagination");

	_generateMarkup() {
		const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
		console.log(numPages);

		const currentPage = this._data.page;

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
		return `
      <button class="btn--inline pagination__btn--${direction}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${direction === "prev" ? "left" : "right"}"></use>
        </svg>
        <span>Page ${direction === "prev" ? currentPage - 1 : currentPage + 1}</span>
      </button>
    `;
	}
}

export default new PaginationView();
