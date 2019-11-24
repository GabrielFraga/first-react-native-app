import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import propTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    loading: false,
    page: 1,
    refreshing: true,
  };

  static propTypes = {
    navigation: propTypes.shape({
      getParam: propTypes.func,
    }).isRequired,
  };

  async componentDidMount() {
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`users/${user.login}/starred`);
    this.setState({stars: response.data, refreshing: false});
  }

  loadMore = async () => {
    const {page, loading, stars} = this.state;

    if (loading) return;

    const loadPage = page + 1;

    this.setState({loading: true});

    const {navigation} = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(
      `users/${user.login}/starred?page=${loadPage}`
    );

    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
      page: loadPage,
    });
  };

  refreshList = async () => {
    this.setState({refreshing: true});

    this.componentDidMount();
  };

  handleNavigate = repository => {
    const {navigation} = this.props;
    console.tron.log(repository);
    navigation.navigate('Repository', {repository});
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading, refreshing} = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
          onEndReached={this.loadMore} // Função que carrega mais itens
          onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
          refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
          renderItem={({item}) => (
            <Starred onPress={() => this.handleNavigate(item)}>
              {/* <RepositoryButton></RepositoryButton> */}
              <OwnerAvatar source={{uri: item.owner.avatar_url}} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
        {loading ? <ActivityIndicator color="#7159c1" /> : false}
      </Container>
    );
  }
}
