import PropTypes from 'prop-types';

// Prop type for a toggle function
export const CloseTogglePropType = PropTypes.func;

// Prop type for a search term (string)
export const SearchTermPropType = PropTypes.string;

// Prop type for a function to set the search term
export const SetSearchTermPropType = PropTypes.func;

// Prop type for a message string
export const MessagePropType = PropTypes.string.isRequired;

// Prop type for a user object
export const UserPropType = PropTypes.shape({
  id: PropTypes.string.isRequired, // User ID
  username: PropTypes.string.isRequired, // User's name
  email: PropTypes.string, // Optional email
  image: PropTypes.string,
  displayPic: PropTypes.string, // Optional URL for the user's display picture
});

// Prop type for a single collection
export const CollectionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired, // Collection ID
  name: PropTypes.string.isRequired, // Collection name
  description: PropTypes.string, // Optional description of the collection
});

// Prop type for an array of collections
export const CollectionsArrayPropType = PropTypes.arrayOf(CollectionPropType).isRequired;

// Prop type for a postedBy object (within a pin)
export const PostedByPropType = PropTypes.shape({
    _id: PropTypes.string.isRequired, // ID of the user who posted
    username: PropTypes.string.isRequired, // Username of the poster
    image: PropTypes.string, // Optional image URL for the poster
  });
  
  // Prop type for a save object (within a pin)
  export const SavePropType = PropTypes.shape({
    _id: PropTypes.string.isRequired, // Save ID
    user: PropTypes.string.isRequired, // User ID who saved the pin
  });
  
  // Prop type for a pin object
  export const PinPropType = PropTypes.shape({
    _id: PropTypes.string.isRequired, // Unique pin ID
    image: PropTypes.object.isRequired, // Image URL of the pin
    destination: PropTypes.string, // Optional URL for the pin destination
    save: PropTypes.arrayOf(SavePropType), // Array of save objects
    postedBy: PostedByPropType.isRequired, // Object describing the poster
  });

// Prop type for a pin ID
export const PinIdPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

// Export all prop types for easy imports
export default {
    CloseTogglePropType,
    SearchTermPropType,
    SetSearchTermPropType,
    MessagePropType,
    UserPropType,
    CollectionPropType,
    CollectionsArrayPropType,
    PostedByPropType,
    SavePropType,
    PinPropType,
    PinIdPropType,
};
