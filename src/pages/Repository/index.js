import React, {Component} from 'react';
import propTypes from 'prop-types';
import {WebView} from 'react-native-webview';

export default class Repository extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('repository').name,
  });

  state = {
    repository: [],
  };

  async componentDidMount() {
    const {navigation} = this.props;
    const repository = navigation.getParam('repository');

    this.setState({
      repository,
    });
  }

  render() {
    const {repository} = this.state;

    return <WebView source={{uri: repository.html_url}} style={{flex: 1}} />;
  }
}

Repository.propTypes = {
  navigation: propTypes.shape({
    getParam: propTypes.func,
  }).isRequired,
};
