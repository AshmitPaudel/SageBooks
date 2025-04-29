// SearchValidations.jsx

const SearchValidations = {
  validateSearchTerm: (term) => {
    const trimmedTerm = term.trim();

    if (!trimmedTerm) {
      return "Search term cannot be empty.";
    } else if (trimmedTerm.length < 2) {
      return "Search term must be at least 2 characters long.";
    } else if (!/^[\w\s.,!?'"@#$%^&*()-]+$/.test(trimmedTerm)) {
      return "Search term contains invalid characters.";
    }

    return "";
  },
};

export default SearchValidations;
