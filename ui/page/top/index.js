import { connect } from 'react-redux';
import TopPage from './view';
import { doClearPublish, doPrepareEdit, doResolveUris } from 'lbry-redux';
import { push } from 'connected-react-router';
import * as PAGES from 'constants/pages';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const name = urlParams.get('name');

  return {
    name,
  };
};

const perform = dispatch => ({
  // eslint-disable-next-line no-undef
  beginPublish: name => {
    dispatch(doClearPublish());
    dispatch(doPrepareEdit({ name }));
    dispatch(push(`/$/${PAGES.UPLOAD}`));
  },
  doResolveUris: uris => dispatch(doResolveUris(uris)),
});

export default connect(select, perform)(TopPage);
