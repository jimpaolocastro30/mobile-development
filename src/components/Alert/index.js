import React, { useState } from 'react'
import { Pressable, Text, View, Modal } from 'react-native'

const Alert = ({ message, btns }) => {
  const [show, setShow] = useState (true)
  return (
    <Modal
      onRequestClose = { () => setShow (false) }
      visible = { show }
      transparent
      animationType = 'fade'
    >
      <View style = {{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        
        <View style = {{
          paddingVertical: 20,
          paddingHorizontal: 25,
          maxWidth: 280,
          alignSelf: 'center',
          backgroundColor: '#327ebc',
          // borderColor: '#fff',
          // borderWidth: 2
        }}>
          <Text style = {{ marginBottom: 20, textTransform: 'uppercase', color: '#eee' }}>{ message }</Text>
          <View style = {{ 
            alignItems: 'center',
            borderTopColor: '#eee',
            borderTopWidth: 1,
            paddingTop: 10
          }}>
            {
              btns.map ((btn, i) => {
                return <Pressable
                  onPress = {
                    (e) => {
                      setShow (false)
                      btn.onPress (e)
                    }
                  }
                  style = {{
                    paddingHorizontal: 5,
                    paddingVertical: 3
                  }}
                  key = { i }>
                    <Text style = {{ fontSize: 13, color: '#eee' }}>{ btn.text }</Text>
                  </Pressable>
              })
            }
          </View>
        </View>


      </View>
    </Modal>
  )
}

export default Alert
