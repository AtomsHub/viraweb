import React, { useRef } from 'react';
import { Text, View, TextInput } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

const CustomDropdown = ({
  placeholder,
  dataSet,
  onSelectItem,
  inputStyle,
  containerStyle,
  title,
  titleStyle,
  containerBgColor,
  error,
  disabled,
  loading,
  onClear,
  initialValue,
  controller, // Pass the controller ref
}) => {
  const inputRef = useRef(null); // Ref for the input component

  return (
    <View>
      {title && (
        <Text className={`text-lg font-MonaSemiBold mb-2 ${titleStyle}`}>
        {title}
      </Text>
      )}
      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        onSelectItem={onSelectItem}
        dataSet={dataSet}
        initialValue={initialValue}
        textInputProps={{
          placeholder,
          placeholderTextColor: '#6b7280',
          editable: !disabled,
          style: [{
            color: disabled ? '#9ca3af' : '#1f2937',
            fontSize: 14,
            paddingVertical: 8,
          }, inputStyle],
          ref: inputRef, // Pass the input ref
        }}
        inputContainerStyle={[{
          backgroundColor: 'rgba(242, 249, 250, 0.55)', // rgba equivalent of #F2F9FA with 0.55 opacity
          borderWidth: 1,
          borderColor: '#CBE7EB',
          borderRadius: 8,
          height: 52,
          alignItems: 'center',
          opacity: disabled ? 0.6 : 1,
        }, containerStyle]}
        suggestionsListTextStyle={{
          color: '#1f2937',
        }}
        suggestionsListContainerStyle={{
          backgroundColor: '#F2F9FA',
          borderColor: '#97D0DA',
        }}
        EmptyResultComponent={
          <Text style={{ padding: 10, color: '#6b7280' }}>
            No items found
          </Text>
        }
        ChevronIconComponent={
          <Text style={{ color: disabled ? '#9ca3af' : '#79A6AE' }}>▼</Text>
        }
        ClearIconComponent={
          <Text style={{ color: disabled ? '#9ca3af' : '#1f2937' }}>x</Text>
        }
        renderItem={(item) => (
          <Text style={{
            padding: 15,
            color: '#1f2937',
            fontSize: 13,
          }}>
            {item.title}
          </Text>
        )}
        loading={loading}
        enableLoadingIndicator={loading}
        onClear={onClear}
        controller={controller} // Pass the controller ref
        InputComponent={TextInput} // Use the default TextInput component
      />
      {error && <Text className={`text-xs font-pRegular text-error-textLink`}>{error}</Text>}
    </View>
  );
};

export default CustomDropdown;