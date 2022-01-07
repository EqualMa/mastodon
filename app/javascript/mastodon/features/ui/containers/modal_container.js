import { connect } from 'react-redux';
import { closeModal } from '../../../actions/modal';
import ModalRoot from '../components/modal_root';

const mapStateToProps = state => ({
  ...state.getIn(['modal', 0, 'modalRootProps']),
  type: state.getIn(['modal', 0, 'modalType'], null),
  props: state.getIn(['modal', 0, 'modalProps'], {}),
});

const mapDispatchToProps = dispatch => ({
  onClose () {
    dispatch(closeModal());
  },
});

const mergeProps = (
  { onClose: stateOnClose, ...stateProps },
  { onClose: dispatchOnClose, ...dispatchProps },
  ownProps,
) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClose: () => {
    dispatchOnClose();
    stateOnClose?.();
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalRoot);
