// -------------------------------------------
// STEP 8 ProfileCard Thumbnail
// -------------------------------------------
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//Esto es un helper para gestionar datos inmutables
import update from 'immutability-helper';
import { Image, Platform, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

const userImage = require('./user.png');

const data = [{
    image: userImage,
    name: 'John Doe',
    occupation: 'React Native Developer',
    description: 'John is a really great Javascript developer. He loves using JS to build React Native applications for iOS and Android',
    showThumbnail: true
  }
];

const ProfileCard = (props) => {

  //Extrae las propiedades
  const { image, name, occupation, description, onPress, showThumbnail } = props;
  let containerStyles = [styles.cardContainer];

  //Esto tiene el efecto de reducir todo un 80%
  if (showThumbnail) {
    containerStyles.push(styles.cardThumbnail);
  }

  return (
    <TouchableHighlight onPress={onPress}>
      <View style={[containerStyles]}>
        <View style={styles.cardImageContainer}>
          <Image style={styles.cardImage} source={image}/>
        </View>
        <View>
          <Text style={styles.cardName}>
            {name}
          </Text>
        </View>
        <View style={styles.cardOccupationContainer}>
          <Text style={styles.cardOccupation}>
            {occupation}
          </Text>
        </View>
        <View>
          <Text style={styles.cardDescription}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  )
};

//Especifica que propiedades tienen que estar en el props
ProfileCard.propTypes = {
  image: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  occupation: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showThumbnail: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired
};

export default class App extends Component<{}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: data
    }
  }

  //Gestiona cuando se presiona el control
  handleProfileCardPress = (index) => {

    const showThumbnail = !this.state.data[index].showThumbnail;
    /*Al usar el helper update, lo que estamos diciendo es que vamos a cambiar
    this.state.data, pero estamos indicando que solo hemos cambiado los datos para la entrada index, y además dentro de la entrada index estamos diciendo que solo vamos a cambiar la propiedad showThumbnail. Esto facilita el rendimiento de aquellas en operaciones en las que solo hacemos el re-rendering cuando un determinado campo ha cambiado - shouldComponentUpdate(), etc.
    */
    this.setState({
      data: update(this.state.data, {[index]: {showThumbnail: {$set: showThumbnail}}})
    });
  };

  render() {
    //Obtiene una lista con todas las tarjetas que hay que listar. Usamos la propiedad Key para que React getione los items de la lista
    const list = this.state.data.map(function(item, index) {
      const { image, name, occupation, description, showThumbnail } = item;
      return <ProfileCard key={'card-' + index}
                          image={image}
                          name={name}
                          occupation={occupation}
                          description={description}
                          onPress={this.handleProfileCardPress.bind(this, index)}
                          showThumbnail={showThumbnail}/>
    }, this);

    return (
      <View style={styles.container}>
        {list}
      </View>
    );
  }
}

const profileCardColor = 'dodgerblue';

//Define estilos. Hay estilos que son especificos de la plataforma. Usamos ...Platform.select({
//El estilo cardThumbnail reduce un 80% el tamaño
const styles = StyleSheet.create({
  cardThumbnail: {
    transform: [{scale: 0.2}]
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainer: {
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 3,
    borderStyle: 'solid',
    borderRadius: 20,
    backgroundColor: profileCardColor,
    width: 300,
    height: 400,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {
            height: 10
        },
        shadowOpacity: 1
      },
      android: {
        elevation: 15
      }
    })
  },
  cardImageContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: 'black',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 30,
    paddingTop: 15,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {
            height: 10,
        },
        shadowOpacity: 1
      },
      android: {
        borderWidth: 3,
        borderColor: 'black',
        elevation: 15
      }
    })
  },
  cardImage: {
    width: 80,
    height: 80
  },
  cardName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 30,
    textShadowColor: 'black',
    textShadowOffset: {
        height: 2,
        width: 2
    },
    textShadowRadius: 3
  },
  cardOccupationContainer: {
    borderColor: 'black',
    borderBottomWidth: 3
  },
  cardOccupation: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  cardDescription: {
    fontStyle: 'italic',
    marginTop: 10,
    marginRight: 40,
    marginLeft: 40,
    marginBottom: 10
  }
});
