import ProfileEditButtons from '@/components/buttons/Profile';
import ProfileCard from '@/components/cards/ProfileCard';
import { uploadToS3 } from '@/database/s3Client';
import { UserModel } from '@/database/models/userModel';
import type { ButtonInteraction, CacheType } from 'discord.js';

const showProfile = async (interaction: ButtonInteraction<CacheType>) => {
    let User = await UserModel.findOne({
        userId: interaction.user.id
    })
    
    if (!User) { 
        User = await UserModel.create({
            userId: interaction.user.id,
            userName: interaction.user.username,
            userAvatar: interaction.user.avatar,
            lastActivityAt: Date.now(),
        })
    };
    
    const buttons = ProfileEditButtons();
    if (!buttons) return;
    
    const profileCard = User.about.profileCard;
    
    if (!profileCard) {
        const card = await ProfileCard(User);
        if (!card) return console.log('no card');
        
        await interaction.reply({ files: [card.imageAttachment], components: [buttons], flags: "Ephemeral" })    

        const fileName = `${interaction.user.id}.webp`;
        const url = await uploadToS3(fileName, card.buffer);

        if (!url) return;

        User.about.profileCard = url;
        await User.save()
    } else {
        interaction.reply({ files: [profileCard], components: [buttons], flags: 'Ephemeral' });
    }
}

export default showProfile;