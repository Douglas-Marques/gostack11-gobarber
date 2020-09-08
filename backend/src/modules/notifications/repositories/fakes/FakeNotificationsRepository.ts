import { ObjectID } from 'mongodb';

import INotificationRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

class FakeNotificationsRepository implements INotificationRepository {
  private ormRepository: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.ormRepository.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
