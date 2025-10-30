import React from 'react';
import { View, StyleSheet } from 'react-native';
import Chip from './Chip';

type Props = { value: string; onChange: (value: string) => void };

const CATS = ['All','Food','Groceries','Transport','Bills','Shopping','Subscriptions','Health','Misc'];

export default function FiltersRow({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {CATS.map((c) => (
        <Chip key={c} text={c} active={value === c} onPress={() => onChange(c)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
});



