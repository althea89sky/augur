import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FilterDropdown from 'modules/filter-sort/components/filter-dropdowns';
import {
  updateFilterSortOptions,
} from 'modules/filter-sort/actions/update-filter-sort-options';

const mapStateToProps = state => ({
  defaultSort: state.filterSortOptions.sortBy,
});

const mapDispatchToProps = dispatch => ({
  updateFilterSortOptions: filterOptions => dispatch(updateFilterSortOptions(filterOptions)),
});

const FilterDropdownsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FilterDropdown)
) as any;

export default FilterDropdownsContainer;
