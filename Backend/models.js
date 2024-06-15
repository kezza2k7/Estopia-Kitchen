const { Sequelize, DataTypes } = require('sequelize');

const Itemdb = new Sequelize({
  dialect: 'sqlite',
  storage: './../data/items.sqlite',
  logging: false
});

const invitesdb = new Sequelize({
  dialect: 'sqlite',
  storage: './../data/invites.sqlite',
  logging: false
});

const Shopdb = new Sequelize({
  dialect: 'sqlite',
  storage: './../data/Shoplist.sqlite',
  logging: false
});

const usersdb = new Sequelize({
    dialect: 'sqlite',
    storage: './../data/users.sqlite',
    logging: false
});

const mealdb = new Sequelize({
  dialect: 'sqlite',
  storage: './../data/meals.sqlite',
  logging: false
});

const kitchendb = new Sequelize({
  dialect: 'sqlite',
  storage: './../data/kitchen.sqlite',
  logging: false
});

// Define a model
const Item = Itemdb.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiryDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kitchen: {
    type: DataTypes.INTEGER
  },
  barcodeid: {
    type: DataTypes.STRING
  },
  brand: {
    type: DataTypes.STRING
  },
  shop: {
    type: DataTypes.STRING
  },
  novagroup: {
    type: DataTypes.STRING
  },
  ingredients: {
    type: DataTypes.STRING
  },
  carbs: {
    type: DataTypes.STRING
  },
  energy: {
    type: DataTypes.STRING
  },
  fat: {
    type: DataTypes.STRING
  },
  satfat: {
    type: DataTypes.STRING
  },
  fiber: {
    type: DataTypes.STRING
  },
  salt: {
    type: DataTypes.STRING
  },
  proteins: {
    type: DataTypes.STRING
  },
  sodium: {
    type: DataTypes.STRING
  },
  sugars: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING
  }
});

const Shopping = Shopdb.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kitchen: {
    type: DataTypes.INTEGER
  },
  selected: {
    type: DataTypes.BOOLEAN
  }
});

const Users = usersdb.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sessionid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    additional: {
      type: DataTypes.JSON,
      allowNull: true
    }
  });

  const kitchentranssq = kitchendb.define('kitchentrans', {
    trans_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kitchen_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex' // Define unique constraint for kitchen_id
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex' // Define unique constraint for user_id
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['kitchen_id', 'user_id'] // Create composite unique index
      }
    ]
  });

  const kitchensq = kitchendb.define('kitchens', {
    kitchen_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kitchen_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    kitchen_owner: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  });

  const mealssq = mealdb.define('Item', {
    meal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kitchen_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    breakfast: {
      type: DataTypes.STRING
    },
    lunch: {
      type: DataTypes.STRING
    },
    dinner: {
      type: DataTypes.STRING
    },
    snacks: {
      type: DataTypes.STRING
    },
  });

  const InviteLinks = invitesdb.define('InviteLinks', {
    token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    expirationTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    kitchenid: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

// Sync the model with the database
usersdb.sync().then(() => {
  console.log('Users Synced');
});

Itemdb.sync({ alter: true }).then(() => {
    console.log('Items Synced');
});

Shopdb.sync().then(() => {
  console.log('Shopping Lists Synced');
});

mealdb.sync().then(() => {
  console.log('Meals Lists Synced');
});
  
kitchendb.sync().then(() => {
  console.log('KitchenTrans and Kitchen Synced');
});

invitesdb.sync().then(() => {
  console.log('Invite Links Synced');
});

module.exports = {
    Users,
    Item,
    Shopping,
    mealssq,
    kitchensq,
    kitchentranssq,
    InviteLinks
}