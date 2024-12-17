import { StyleSheet, View } from 'react-native'

const Line = () => {
    return (
    <View style={styles.line}>
    </View>
    )
}

export default Line

const styles = StyleSheet.create({
    line: {
        width: "100%",
        height: 1,
        backgroundColor: "#ccc",
    },
})