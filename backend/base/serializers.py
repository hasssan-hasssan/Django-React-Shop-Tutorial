from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from base.models import Product, ShippingAddress, Order, OrderItem


# Define a serializer for the User model to customize the JSON representation
class UserSerializer(serializers.ModelSerializer):
    # Add custom serializer method fields for additional or transformed data
    # Custom field to retrieve the user ID
    _id = serializers.SerializerMethodField()
    # Custom field to retrieve the user's name
    name = serializers.SerializerMethodField()
    # Custom field to indicate admin status
    isAdmin = serializers.SerializerMethodField()

    class Meta:
        # Specify the model and fields to include in the serialization
        model = User
        # Fields exposed in the API response
        fields = ['_id', 'username', 'email', 'name', 'isAdmin']

    # Custom method to retrieve the user's ID
    def get__id(self, obj):
        return obj.id  # Return the primary key (ID) of the user object

    # Custom method to retrieve the user's name
    def get_name(self, obj):
        name = obj.first_name  # Retrieve the first name of the user
        if name == '':         # If the first name is empty, use the user's email as the name
            name = obj.email
        return name

    # Custom method to check if the user is an admin
    def get_isAdmin(self, obj):
        # Return the admin status (True if the user is staff)
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


# Custom serializer to extend TokenObtainPairSerializer for additional functionality
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    # The following method is commented out but can be used to add custom claims to the token
    # @classmethod
    # def get_token(cls, user):
    #     token = super().get_token(user)  # Retrieve the standard token from the parent class

    #     # Add custom claims to the token (e.g., username)
    #     token['username'] = user.username
    #     # Add more claims as needed...

    #     return token  # Return the customized token

    # Override the validate method to include additional serialized user data
    def validate(self, attrs):
        # Call the parent class's validate method to get the default validation logic
        data = super().validate(attrs)

        # Serialize the user object using a custom serializer (UserSerializerWithToken)
        serializer = UserSerializerWithToken(self.user).data

        # Merge the serialized user data into the token response
        for k, v in serializer.items():
            data[k] = v

        # Return the final token data, including the additional user information
        return data


# Serializer for the Product model to convert model instances into JSON format
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product  # Specify the model to serialize
        fields = "__all__"  # Include all fields of the Product model


# Serializer for the ShippingAddress model
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress  # Specify the model to serialize
        fields = "__all__"  # Include all fields of the ShippingAddress model


# Serializer for the OrderItem model with a custom field for the image URL
class OrderItemSerializer(serializers.ModelSerializer):
    # Custom method field to handle image URLs
    image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem  # Specify the model to serialize
        fields = "__all__"  # Include all fields of the OrderItem model

    # Custom method to build the absolute URL for the image
    def get_image(self, obj):
        # Get the request context (needed for absolute URL)
        request = self.context.get('request')
        if request:
            # Build absolute URL for the image
            return request.build_absolute_uri(obj.image)
        return obj.image  # Return the image URL as-is if no request context


# Serializer for the Order model with nested and custom fields
class OrderSerializer(serializers.ModelSerializer):
    # Custom field to serialize the associated shipping address
    shippingAddress = serializers.SerializerMethodField()
    # Custom field to serialize associated order items
    orderItems = serializers.SerializerMethodField()
    # Custom field to serialize the user who placed the order
    user = serializers.SerializerMethodField()

    class Meta:
        model = Order  # Specify the model to serialize
        fields = "__all__"  # Include all fields of the Order model

    # Custom method to serialize the associated ShippingAddress
    def get_shippingAddress(self, obj):
        try:
            # Serialize the related ShippingAddress instance
            address = ShippingAddressSerializer(obj.shippingaddress).data
        except ShippingAddress.order.RelatedObjectDoesNotExist:
            # Handle the case where no associated ShippingAddress exists
            address = False
        return address

    # Custom method to serialize the associated OrderItem instances
    def get_orderItems(self, obj):
        # Retrieve all order items related to the Order instance
        items = obj.orderitem_set.all()
        # Serialize the order items and include the request context
        return OrderItemSerializer(items, many=True, context=self.context).data

    # Custom method to serialize the user associated with the order
    def get_user(self, obj):
        # Serialize the user instance using the UserSerializer
        return UserSerializer(obj.user, many=False).data
