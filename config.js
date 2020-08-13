module.exports = {
    defaultPrefix: process.env.PREFIX,
    ownerID:  process.env.OWNERID,
    defaultMessageLifetime: Number(process.env.DEFAULTLIFETIME) || 3,
    defaultBufferLimit: Number(process.env.DEFAULTBUFFERLIMIT) || 50,
    limits: {
        // this is the limits for message lifetime, buffer limit where the user can change the value of them between them
        // [0,1] => 0 means lowest selectable number, 1 means highest slectable number
        messageLifetime: [1,10],
        bufferlimit: [10, 150],
    }
}